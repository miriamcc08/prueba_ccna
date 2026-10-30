#!/usr/bin/env python3
"""Optional authoring check: requires PyYAML 6.0.3 and the two hash-pinned primary sources.

Parses the reviewed playbook and checks published argument shapes, not device execution.
Run from the repository: python3 tools/check-reviewed-automation-yaml.py
"""
import argparse
import ast
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    'cisco.ios.ios_system': '8417abf9397c3f53939cfe363aa6f2a97fc90d35dd228c4661ef98036176e572',
    'cisco.ios.ios_ntp_global': 'c5c9cbf6223565e62ac872833f97c2dbc61117498cff0a83d67fb7215979a643',
}


def check(cache):
    import yaml
    schemas = {}
    for module, digest in SOURCES.items():
        paths = [p for p in cache.rglob(digest + '.*') if p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest() == digest]
        if len(paths) != 1:
            raise ValueError('Missing or ambiguous primary-source copy: ' + module)
        tree = ast.parse(paths[0].read_text())
        document = next(ast.literal_eval(n.value) for n in tree.body if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == 'DOCUMENTATION' for t in n.targets))
        schemas[module] = yaml.safe_load(document)['options']

    def value_check(value, spec, location):
        kind = spec.get('type', 'str')
        expected = {'str': str, 'bool': bool, 'int': int, 'dict': dict, 'list': list}
        if kind != 'raw' and type(value) is not expected[kind]:
            raise ValueError('Wrong published parameter type: ' + location)
        if 'choices' in spec and value not in spec['choices']:
            raise ValueError('Unsupported published choice: ' + location)
        if kind == 'dict':
            mapping_check(value, spec.get('suboptions', {}), location)
        elif kind == 'list':
            for number, item in enumerate(value):
                value_check(item, {'type': spec.get('elements', 'str'), 'suboptions': spec.get('suboptions', {})}, f'{location}[{number}]')

    def mapping_check(value, schema, location):
        for key, item in value.items():
            if key not in schema:
                raise ValueError('Unknown published parameter: ' + location + '.' + key)
            value_check(item, schema[key], location + '.' + key)

    questions = json.loads((ROOT / 'server/prisma/questions/reviewed_batch2_automation_corrections_20261030.json').read_text())['questions']
    q = next(q for q in questions if q['id'] == 'ccna-legacy-batch2_automation-005-review-r1')
    values, hashes = [], []
    for lang in ['En', 'Es']:
        literal = re.search(r'```yaml\n(.*?)```', q['statement' + lang], re.S)[1]
        plays = yaml.safe_load(literal)
        assert len(plays) == 1 and plays[0]['hosts'] == 'access_switches'
        assert plays[0]['connection'] == 'ansible.netcommon.network_cli'
        tasks = plays[0]['tasks']
        assert len(tasks) == 2
        for task in tasks:
            module = next(key for key in task if key != 'name')
            assert set(task) == {'name', module} and module in schemas
            mapping_check(task[module], schemas[module], module)
        values.append(plays)
        hashes.append(hashlib.sha256(literal.encode()).hexdigest())
    assert values[0] == values[1] and hashes[0] == hashes[1]
    return {'questionId': q['id'], 'yamlSha256': hashes[0], 'parser': 'PyYAML ' + yaml.__version__,
            'primaryModuleSha256': SOURCES, 'plays': 1, 'tasks': 2,
            'moduleOrder': [next(key for key in t if key != 'name') for t in values[0][0]['tasks']],
            'argumentShapes': 'matched_published_documentation', 'bilingualYamlIdentical': True,
            'scope': 'Parsed YAML and published parameter names/types/choices; no Ansible or IOS execution.'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cache', type=Path, default=ROOT.parent / '.ccna-cache/references')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    result = json.dumps(check(args.cache), ensure_ascii=False, indent=2) + '\n'
    if args.output:
        args.output.write_text(result)
    else:
        print(result, end='')
