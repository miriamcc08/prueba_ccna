#!/usr/bin/env python3
"""Verify reviewed HTTP fixture facts and bind the separately executed YAML check.

This dependency-free check verifies the frozen YAML artifact's binding, not a fresh
YAML parse. Re-run check-reviewed-automation-yaml.py with PyYAML for that step.
"""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def review():
    questions = json.loads((ROOT / 'server/prisma/questions/reviewed_batch2_automation_corrections_20261030.json').read_text())['questions']
    by_id = {q['id']: q for q in questions}
    records = []
    identity = 'ccna-legacy-batch2_automation-004-review-r1'
    q = by_id[identity]
    results = []
    for lang in ['En', 'Es']:
        literal = re.search(r'```http\n(.*?)```', q['statement' + lang], re.S)[1]
        header, body = literal.strip().split('\n\n', 1)
        status = int(re.match(r'HTTP/1\.1 (\d{3}) ', header)[1])
        payload = json.loads(body)
        assert status == payload['error']['statusCode'] == 401
        assert payload['error']['errorCode'] == 'AUTH_TOKEN_EXPIRED'
        # Only fixture status/body consistency is checked; the question explicitly
        # omits other response headers and does not claim a complete HTTP capture.
        results.append({'status': status, 'errorCode': payload['error']['errorCode']})
    assert results[0] == results[1]
    records.append({'id': identity, 'kind': 'http_excerpt_json_consistency', 'result': results[0], 'passed': True})

    artifact = json.loads((ROOT / 'docs/comprobacion-ansible-20261030.json').read_text())
    q = by_id[artifact['questionId']]
    for lang in ['En', 'Es']:
        literal = re.search(r'```yaml\n(.*?)```', q['statement' + lang], re.S)[1]
        assert hashlib.sha256(literal.encode()).hexdigest() == artifact['yamlSha256']
    assert artifact['plays'] == 1 and artifact['tasks'] == 2
    assert artifact['moduleOrder'] == ['cisco.ios.ios_ntp_global', 'cisco.ios.ios_system']
    assert artifact['bilingualYamlIdentical'] is True
    assert artifact['argumentShapes'] == 'matched_published_documentation'
    assert artifact['parser'] == 'PyYAML 6.0.3'
    assert all(re.fullmatch(r'[0-9a-f]{64}', h) for h in artifact['primaryModuleSha256'].values())
    result = {key: artifact[key] for key in ['yamlSha256', 'primaryModuleSha256', 'plays', 'tasks', 'moduleOrder', 'bilingualYamlIdentical']}
    records.append({'id': q['id'], 'kind': 'bound_yaml_argument_check_artifact', 'result': result, 'passed': True})
    return {'checked': len(records), 'records': records,
            'scope': 'Fixture consistency and binding to an executed YAML/source-schema check, not IOS/Ansible execution or fresh YAML parsing.'}


if __name__ == '__main__':
    print(json.dumps(review(), ensure_ascii=False, indent=2))
