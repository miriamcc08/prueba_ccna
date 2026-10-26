#!/usr/bin/env python3
"""Flag lexical similarity for editorial review; this is not semantic deduplication."""
import argparse
import difflib
import json
import re
from pathlib import Path


def normalize(text):
    text = re.sub(r'\b(?:\d{1,3}\.){3}\d{1,3}(?:/\d+)?\b', ' IP ', text.lower())
    text = re.sub(r'\b\d+\b', ' N ', text)
    return ' '.join(re.findall(r'[a-z]+', text))


def screen(batch_path, threshold=.72):
    path = Path(batch_path).resolve()
    batch = json.loads(path.read_text())
    existing = []
    for file in sorted(path.parent.glob('*.json')):
        if file.resolve() == path:
            continue
        payload = json.loads(file.read_text())
        for index, question in enumerate(payload['questions'] if isinstance(payload, dict) else payload):
            existing.append((file.name, index, normalize(question['statementEn'])))
    flags = []
    for question in batch['questions']:
        text = normalize(question['statementEn'])
        ranked = [(difflib.SequenceMatcher(None, text, old, autojunk=False).ratio(), file, index) for file, index, old in existing]
        if not ranked:
            continue
        score, file, index = max(ranked)
        if score >= threshold:
            flags.append({'id': question['id'], 'candidateFile': file, 'candidateIndex': index, 'similarity': round(score, 3), 'note': 'Potential lexical similarity, not a confirmed semantic duplicate.'})
    return {'batchId': batch['batchId'], 'checkedAgainst': len(existing), 'received': len(batch['questions']), 'threshold': threshold, 'potentialNearDuplicates': flags, 'scope': 'English lexical screening after masking numeric IPv4 values. Related exercises retain declared families and are not counted as independent concepts. No guarantee of complete semantic deduplication.'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('batch')
    parser.add_argument('--output', required=True)
    parser.add_argument('--threshold', type=float, default=.72)
    args = parser.parse_args()
    if not 0 < args.threshold <= 1:
        parser.error('threshold must be greater than zero and at most one')
    Path(args.output).write_text(json.dumps(screen(args.batch, args.threshold), indent=2) + '\n')
