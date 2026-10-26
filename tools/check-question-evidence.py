#!/usr/bin/env python3
"""Check evidence provenance and bind recorded review to content, without granting approval.

Default mode checks the saved manifest and review fingerprints offline. --check-cache
also verifies retrieved bytes and supporting passage anchors in the local reference cache.
A recorded review may identify a directly consulted chapter separately from its
original general citation. Neither mode proves that an answer follows logically
from a passage.
"""
import argparse
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path


class DocumentText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.suppressed = 0

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'noscript', 'template'):
            self.suppressed += 1

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript', 'template'):
            self.suppressed = max(0, self.suppressed - 1)

    def handle_data(self, data):
        if not self.suppressed:
            self.parts.append(data)


def content_hash(question):
    payload = {key: value for key, value in question.items() if key != 'verification'}
    return hashlib.sha256(json.dumps(payload, sort_keys=True, ensure_ascii=False,
                                     separators=(',', ':')).encode()).hexdigest()


def check_evidence(batch_path, references_path, check_cache=False, reviewed_only=False):
    batch = json.loads(Path(batch_path).read_text())
    references = json.loads(Path(references_path).read_text())
    if batch['batchId'] != references['batchId']:
        raise ValueError('Evidence belongs to another batch')
    documents = {doc['url']: doc for doc in references['documents']}
    entries = references['focusedEvidence']
    evidence = {entry['questionId']: entry for entry in entries}
    question_ids = {q['id'] for q in batch['questions']}
    if len(question_ids) != len(batch['questions']) or len(evidence) != len(entries):
        raise ValueError('Duplicate question or evidence ID')
    if set(evidence) - question_ids:
        raise ValueError('Evidence contains unknown question IDs')
    if reviewed_only:
        if not evidence:
            raise ValueError('Partial review must contain at least one reviewed question')
    elif set(evidence) != question_ids:
        raise ValueError('Evidence question IDs do not match the batch')
    cached = {}

    def validate_document(url, digest, anchors):
        if url not in documents:
            raise ValueError(f'{url}: reference document is not recorded')
        doc = documents[url]
        if doc['status'] != 'retrieved' or doc['sha256'] != digest:
            raise ValueError(f'{url}: document provenance differs')
        if not anchors or any(not anchor.strip() for anchor in anchors):
            raise ValueError(f'{url}: empty evidence anchor')
        if check_cache:
            if url not in cached:
                raw = Path(doc['cachePath']).read_bytes()
                if hashlib.sha256(raw).hexdigest() != digest:
                    raise ValueError(f'{url}: cached document hash differs')
                text = raw.decode('utf-8')
                if '.html' in url:
                    parser = DocumentText()
                    parser.feed(text)
                    text = ' '.join(parser.parts)
                cached[url] = re.sub(r'\s+', ' ', text).casefold()
            for anchor in anchors:
                if re.sub(r'\s+', ' ', anchor).casefold() not in cached[url]:
                    raise ValueError(f'{url}: supporting passage anchor not found')

    records = []
    for q in batch['questions']:
        if reviewed_only and q['id'] not in evidence:
            continue
        v = q['verification']
        entry = evidence[q['id']]
        review = v['documentaryReview']
        digest = content_hash(q)
        if review['contentSha256'] != digest or entry['contentSha256'] != digest:
            raise ValueError(f"{q['id']}: content changed since documentary review")
        if q['validationStatus'] != 'pending_review' or review['humanApproval'] != 'pending':
            raise ValueError(f"{q['id']}: documentary check cannot grant human approval")
        if not v['humanReviewRequired'] or review['reviewerType'] != 'automated_assistant':
            raise ValueError(f"{q['id']}: reviewer attribution differs")
        if v['referenceAccess'] != 'consulted' or not v.get('consultedAt'):
            raise ValueError(f"{q['id']}: consultation record missing")
        if (entry['url'] != q['sourceUrl'] or entry['sha256'] != v['referenceSha256']
                or entry['section'] != v['evidenceSection']
                or entry['anchors'] != v['evidenceAnchors']):
            raise ValueError(f"{q['id']}: evidence record differs")
        document_url = entry.get('documentUrl', q['sourceUrl'])
        if entry.get('documentUrl'):
            if document_url not in documents or v['referenceDocumentUrl'] != documents[document_url].get('finalUrl', document_url):
                raise ValueError(f"{q['id']}: consulted document URL differs")
        validate_document(document_url, v['referenceSha256'], entry['anchors'])
        for secondary in v.get('supportingReferences', []):
            validate_document(secondary['url'], secondary['sha256'], [secondary['anchor']])
        records.append({'id': q['id'], 'reviewBinding': 'passed', 'sourceEvidence': 'cached_bytes_and_anchors_checked' if check_cache else 'manifest_checked',
                        'humanApproval': 'pending', 'contentSha256': digest})
    return {'batchId': batch['batchId'], 'received': len(records), 'batchReceived': len(batch['questions']),
            'questionsWithoutReview': len(question_ids - set(evidence)), 'reviewedOnly': reviewed_only,
            'reviewBindingsPassed': len(records),
            'cachedDocumentsVerified': len(cached), 'technicalApprovals': 0,
            'scope': 'Evidence integrity and review-to-content binding only. Logical correctness, complete source coverage and translation quality are not established by keyword matching.',
            'records': records}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('batch')
    parser.add_argument('--references', required=True)
    parser.add_argument('--check-cache', action='store_true')
    parser.add_argument('--reviewed-only', action='store_true',
                        help='Explicitly check recorded reviews only and report questions without review')
    parser.add_argument('--output')
    args = parser.parse_args()
    report = json.dumps(check_evidence(args.batch, args.references, args.check_cache, args.reviewed_only), ensure_ascii=False, indent=2) + '\n'
    if args.output:
        Path(args.output).write_text(report)
    else:
        print(report, end='')
