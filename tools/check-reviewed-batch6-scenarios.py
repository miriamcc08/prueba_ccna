#!/usr/bin/env python3
"""Derive selected bilingual sixth-batch keys without trusting isCorrect."""
import ast
import ipaddress as ip
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'server/prisma/questions'


def review():
    original = json.loads((ROOT / 'batch6_all.json').read_text())['questions']
    revised = {q['supersedesQuestionId']: q for q in json.loads((ROOT / 'reviewed_batch6_corrections_20261030.json').read_text())['questions']}
    records = []

    def question(n):
        parent = f'ccna-legacy-batch6_all-{n:03}'
        return revised.get(parent, original[n - 1])

    def case(n, kind, result, predicate):
        q = question(n)
        derived = None
        for lang in ['En', 'Es']:
            labels = sorted(o['optionLabel'] for o in q['options'] if predicate(o['optionText' + lang], lang))
            actual = sorted(o['optionLabel'] for o in q['options'] if o['isCorrect'])
            if not labels or labels != actual or (derived is not None and labels != derived):
                raise ValueError(f'{n}: independently derived {lang} key {labels} != {actual}')
            derived = labels
        records.append({'id': q.get('id', f'ccna-legacy-batch6_all-{n:03}'), 'kind': kind,
                        'result': result, 'expectedCorrectLabels': derived, 'passed': True})

    q = question(3)
    results = []
    for lang in ['En', 'Es']:
        statement = q['statement' + lang]
        parent = ip.ip_network(re.search(r'172\.24\.0\.0/\d+', statement)[0])
        prefix = int(re.search(r'(?<![\w.])/([0-9]+)', statement)[1])
        networks = list(parent.subnets(new_prefix=prefix))
        results.append({'subnets': len(networks), 'usableHosts': networks[0].num_addresses - 2})
    assert results[0] == results[1] == {'subnets': 64, 'usableHosts': 1022}
    case(3, 'enumerated_flsm_subnets', results[0], lambda t, _: [int(x.replace(',', '')) for x in re.findall(r'\d[\d,]*', t)] == [64, 1022])

    q = question(4)
    addresses = []
    for lang in ['En', 'Es']:
        statement = q['statement' + lang]
        mac = bytes.fromhex(re.search(r'(?:[0-9a-f]{2}:){5}[0-9a-f]{2}', statement, re.I)[0].replace(':', ''))
        iid = bytes([mac[0] ^ 2]) + mac[1:3] + b'\xff\xfe' + mac[3:]
        prefix = ip.ip_network(re.search(r'[0-9a-f:]+/64', statement, re.I)[0])
        addresses.append(str(ip.ip_address(int(prefix.network_address) | int.from_bytes(iid))))
        alternatives = [ip.ip_address(o['optionText' + lang]) for o in q['options']]
        assert len(alternatives) == len(set(alternatives)), 'Equivalent IPv6 alternatives'
    assert addresses[0] == addresses[1] == '2001:db8:acad:10:250:56ff:fea3:8c1f'
    case(4, 'modified_eui64_unique_alternatives', addresses[0], lambda t, _: ip.ip_address(t) == ip.ip_address(addresses[0]))

    excluded = list(map(ip.ip_network, ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '100.64.0.0/10']))
    q = question(5)
    selected = [o['optionTextEn'] for o in q['options'] if not any(ip.ip_address(o['optionTextEn']) in p for p in excluded)]
    assert selected == ['11.20.30.40', '195.20.10.5']
    case(5, 'explicit_private_shared_ranges', selected, lambda t, _: not any(ip.ip_address(t) in p for p in excluded))

    speeds = [100, 1000, 10000]
    default_costs = [max(1, 100 // rate) for rate in speeds]
    new_costs = [max(1, 10000 // rate) for rate in speeds]
    assert default_costs == [1, 1, 1] and new_costs == [100, 10, 1]
    case(28, 'ospf_reference_bandwidth_costs', {'defaultCosts': default_costs, 'reference10000Costs': new_costs}, lambda t, _: 'auto-cost reference-bandwidth 10000' in t)

    winners = []
    for lang in ['En', 'Es']:
        routes = re.findall(r'([\d.]+/\d+)\s+\[[^\]]+\]\s+via ([\d.]+)', question(29)['statement' + lang])
        destination = ip.ip_address('10.130.25.100')
        best = max(((ip.ip_network(prefix), hop) for prefix, hop in routes if destination in ip.ip_network(prefix)), key=lambda r: r[0].prefixlen)
        winners.append({'prefix': str(best[0]), 'nextHop': best[1]})
    assert winners[0] == winners[1] == {'prefix': '10.130.16.0/20', 'nextHop': '192.0.2.5'}
    case(29, 'parsed_ipv4_longest_prefix', winners[0], lambda t, _: all(v in t for v in winners[0].values()))

    values = []
    for lang in ['En', 'Es']:
        text = question(33)['statement' + lang]
        priorities = list(map(int, re.findall(r'standby 1 priority (\d+)', text)))
        decrement = int(re.search(r'standby 1 track GigabitEthernet0/0/0 (\d+)', text)[1])
        values.append({'R1': priorities[0] - decrement, 'R2': priorities[1]})
    assert values[0] == values[1] == {'R1': 85, 'R2': 100}
    case(33, 'parsed_hsrp_tracking_decrement', values[0], lambda t, _: bool(re.search(r'\b85\b', t)) and 'R2' in t)

    levels = [n for n in range(8) if n <= 6]
    assert levels == list(range(7))
    case(37, 'exclusive_syslog_threshold', {'included': levels, 'excluded': [7]}, lambda t, _: 'logging host 10.10.10.50' in t and 'logging trap informational' in t)

    flags = [0, 2, 4, 16, 18, 20]
    matches = {str(value): bool(value & (0x10 | 0x04)) for value in flags}
    assert matches == {'0': False, '2': False, '4': True, '16': True, '18': True, '20': True}
    case(40, 'stateless_established_flag_mask', matches, lambda t, lang: 'ACK' in t and 'RST' in t and ('does not verify' in t if lang == 'En' else 'no verifica' in t))

    for lang in ['En', 'Es']:
        rows = re.findall(r'^\s*(\d+)\s+(permit|deny)\s+(tcp|ip)\s+(.+)$', question(41)['statement' + lang], re.M)
        assert [int(row[0]) for row in rows] == [10, 20, 30]
        matches = []
        for seq, action, proto, rest in rows:
            fields = rest.split()
            if fields[0] == 'any':
                source_match = True
            else:
                base, wildcard = map(ip.ip_address, fields[:2])
                mask = ((1 << 32) - 1) ^ int(wildcard)
                source_match = int(ip.ip_address('192.168.1.45')) & mask == int(base) & mask
            port_match = 'eq ' not in rest or int(re.search(r'eq (\d+)', rest)[1]) == 80
            if source_match and port_match:
                matches.append((int(seq), action))
        assert matches[0] == (10, 'permit') and matches[1] == (20, 'permit')
    case(41, 'ordered_acl_first_matching_counter', {'sequence': 10, 'action': 'permit', 'laterMatchingSequence': 20}, lambda t, lang: ('sequence 10' in t and 'without evaluating sequence 20' in t) if lang == 'En' else ('secuencia 10' in t and 'sin evaluar la secuencia 20' in t))

    def expression(node, data):
        if isinstance(node, ast.Expression): return expression(node.body, data)
        if isinstance(node, ast.Name) and node.id == 'device_data': return data
        if isinstance(node, ast.Constant) and type(node.value) in (str, int): return node.value
        if isinstance(node, ast.Subscript): return expression(node.value, data)[expression(node.slice, data)]
        raise ValueError('Unexpected expression node')

    outcomes = []
    for lang in ['En', 'Es']:
        q = question(46)
        text = q['statement' + lang]
        data, _ = json.JSONDecoder().raw_decode(text[text.index('{'):])
        values = {}
        for o in q['options']:
            try: values[o['optionLabel']] = expression(ast.parse(o['optionText' + lang], mode='eval'), data)
            except (TypeError, KeyError) as error: values[o['optionLabel']] = type(error).__name__
        outcomes.append(values)
    assert outcomes[0] == outcomes[1] == {'A': '10.10.20.1', 'B': '10.10.20.2', 'C': 'TypeError', 'D': 'KeyError'}
    case(46, 'parsed_json_python_subscripts', outcomes[0], lambda t, _: expression(ast.parse(t, mode='eval'), data) == '10.10.20.1' if 'Core-SW1' not in t and 'response' in t else False)
    return {'checked': len(records), 'records': records, 'scope': 'Explicit reviewed inputs only; no blanket approval or IOS emulation.'}


if __name__ == '__main__':
    print(json.dumps(review(), ensure_ascii=False, indent=2))
