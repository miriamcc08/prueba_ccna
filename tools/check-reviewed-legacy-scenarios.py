#!/usr/bin/env python3
"""Independent scenario checks for the explicitly inspected first legacy batch.

These checks derive answers from stated inputs, not from the application's validators.
Passing is necessary evidence for these cases, not editorial approval of arbitrary items.
"""
import ipaddress as ip
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'server/prisma/questions'


def question(file, number, revised=False):
    identity = f'ccna-legacy-{file}-{number:03}' + ('-review-r1' if revised else '')
    if revised:
        items = json.loads((ROOT / 'reviewed_legacy_corrections_20261029.json').read_text())['questions']
        return identity, next(q for q in items if q['id'] == identity)
    return identity, json.loads((ROOT / (file + '.json')).read_text())['questions'][number - 1]


def review():
    records = []

    def check(file, number, kind, result, predicate, revised=False):
        identity, q = question(file, number, revised)
        expected = None
        for language in ['En', 'Es']:
            selected = sorted(o['optionLabel'] for o in q['options'] if predicate(o['optionText' + language], language))
            actual = sorted(o['optionLabel'] for o in q['options'] if o['isCorrect'])
            if not selected or selected != actual or (expected is not None and selected != expected):
                raise ValueError(f'{identity}: independent {language} key mismatch: {selected} != {actual}')
            expected = selected
        records.append({'id': identity, 'kind': kind, 'result': result, 'expectedCorrectLabels': expected, 'passed': True})

    # Largest-first, aligned VLSM allocation, independently using integer addresses.
    parent = ip.ip_network('10.150.16.0/22')
    cursor = int(parent.network_address)
    allocated = []
    for hosts in [230, 110, 55, 28]:
        bits = next(b for b in range(2, 33) if 2**b - 2 >= hosts)
        size = 2**bits
        cursor = ((cursor + size - 1) // size) * size
        subnet = ip.ip_network((cursor, 32 - bits))
        assert subnet.subnet_of(parent)
        allocated.append(subnet)
        cursor += size
    finance = allocated[2]
    values = [str(finance.netmask), str(finance.network_address + 1), str(finance.broadcast_address - 1)]
    check('batch1_network_fundamentals', 8, 'vlsm', {'allocated': [str(n) for n in allocated], 'finance': values},
          lambda text, lang: re.findall(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', text) == values)

    mac = bytearray.fromhex('005056be341a')
    mac[0] ^= 2
    iid = bytes(mac[:3]) + b'\xff\xfe' + bytes(mac[3:])
    address = ip.IPv6Address(int(ip.IPv6Network('2001:db8:acad:1::/64').network_address) | int.from_bytes(iid, 'big'))
    check('batch1_network_fundamentals', 9, 'modified_eui64', str(address), lambda text, lang: text.strip() == str(address))

    bridges = {'A': (32768 + 10, int('000a41111111', 16)), 'B': (28672 + 10, int('000a41333333', 16)), 'C': (32768 + 10, int('000a41222222', 16))}
    root = min(bridges, key=bridges.get)
    # A and C each have a direct cost-4 path to root B; BID breaks the tie on A-C.
    designated = min(['A', 'C'], key=lambda name: (4, bridges[name]))
    alternate = next(name for name in ['A', 'C'] if name != designated)
    check('batch1_network_access', 7, 'stp_root_and_designated', {'root': root, 'designatedOnAC': designated, 'alternateOnAC': alternate},
          lambda text, lang: (text.startswith('Switch ' + root) and ('is elected' in text or 'es elegido' in text)) or
          (bool(re.match(r"(?:Switch " + alternate + r"'s interface|La interfaz de Switch " + alternate + r" )", text)) and 'Alternate' in text and ('Switch ' + designated) in text))

    routes = [('0.0.0.0/0', '192.168.1.1'), ('10.1.0.0/16', '10.0.12.2'), ('10.1.4.0/22', '10.0.14.2'), ('10.1.5.0/24', '10.0.15.2'), ('10.1.5.64/26', '10.0.16.2')]
    best = max(((ip.ip_network(prefix), hop) for prefix, hop in routes if ip.ip_address('10.1.5.75') in ip.ip_network(prefix)), key=lambda item: item[0].prefixlen)
    check('batch1_ip_connectivity', 4, 'longest_prefix', {'prefix': str(best[0]), 'nextHop': best[1]}, lambda text, lang: str(best[0]) in text and best[1] in text)

    offered = [('172.16.10.0/24', 110, 'OSPF', '10.1.1.2'), ('172.16.10.0/24', 90, 'EIGRP', '10.2.2.2'), ('172.16.10.128/25', 110, 'OSPF', '10.3.3.2'), ('172.16.0.0/16', 1, 'static', '10.4.4.2')]
    installed = {}
    for prefix, distance, protocol, hop in offered:
        if prefix not in installed or distance < installed[prefix][0]:
            installed[prefix] = (distance, protocol, hop)
    selected_prefix = max((ip.ip_network(prefix) for prefix in installed if ip.ip_address('172.16.10.130') in ip.ip_network(prefix)), key=lambda n: n.prefixlen)
    hop = installed[str(selected_prefix)][2]
    assert installed['172.16.10.0/24'][1] == 'EIGRP'
    check('batch1_ip_connectivity', 5, 'rib_then_forwarding', {'selectedPrefix': str(selected_prefix), 'nextHop': hop, 'installed24': 'EIGRP'}, lambda text, lang: hop in text and 'EIGRP' in text and '/25' in text)

    router_id = str(max(map(ip.IPv4Address, ['10.10.10.1', '10.200.1.1'])))
    check('batch1_ip_connectivity', 9, 'loopback_router_id', router_id, lambda text, lang: text.strip() == router_id)

    # Established DR/BDR are not preempted by later arrivals in this no-failure timeline.
    dr = bdr = None
    for name, priority in [('R1', 1), ('R2', 100), ('R3', 255)]:
        if priority and dr is None:
            dr = name
        elif priority and bdr is None:
            bdr = name
    other = 'R3'
    check('batch1_ip_connectivity', 12, 'ospf_nonpreemptive_timeline', {'DR': dr, 'BDR': bdr, 'DROTHER': other},
          lambda text, lang: bool(re.search(dr + r' (?:is the|es el) DR', text) and re.search(bdr + r' (?:is the|es el) BDR', text) and other in text))

    levels = list(range(4 + 1))
    check('batch1_ip_services', 4, 'severity_threshold', levels, lambda text, lang: bool(re.search(r'0 (?:through|al) 4', text)))

    # Parse the displayed ACEs and evaluate source wildcard/protocol/destination/port.
    _, acl_q = question('batch1_security_fundamentals', 5)
    source, destination, port = ip.IPv4Address('172.16.21.85'), '192.168.100.50', 80
    decision = None
    for line in acl_q['statementEn'].splitlines():
        match = re.match(r'\s*(\d+) (permit|deny) (tcp|ip) ([\d.]+) ([\d.]+) (host [\d.]+|any)(?: eq (\d+))?', line)
        if not match:
            continue
        sequence, action, protocol, base, wildcard, target, required_port = match.groups()
        mask = 0xffffffff ^ int(ip.IPv4Address(wildcard))
        if (int(source) & mask) != (int(ip.IPv4Address(base)) & mask):
            continue
        if target != 'any' and target != 'host ' + destination:
            continue
        if protocol == 'tcp' and required_port and int(required_port) != port:
            continue
        decision = {'sequence': int(sequence), 'action': action}
        break
    assert decision == {'sequence': 30, 'action': 'deny'}
    check('batch1_security_fundamentals', 5, 'ordered_acl', decision, lambda text, lang: ('line 30' in text or 'secuencia 30' in text) and ('dropped' in text or 'descartado' in text))

    initial = [max(1, 100 // bandwidth) for bandwidth in [1000, 10000]]
    changed = [max(1, 10000 // bandwidth) for bandwidth in [1000, 10000]]
    assert initial == [1, 1] and changed == [10, 1]
    check('batch1_ip_connectivity', 10, 'reference_bandwidth', {'default': initial, 'reference10000': changed}, lambda text, lang: 'reference-bandwidth 10000' in text, True)
    check('batch1_ip_services', 3, 'ntp_stratum_chain', [1 + 1, 1 + 1 + 1], lambda text, lang: bool(re.search(r'Stratum 2|Stratum 2', text, re.I)) and bool(re.search(r'Stratum 3', text, re.I)), True)
    wildcard = str(ip.IPv4Network('10.24.16.0/21').hostmask)
    check('batch1_security_fundamentals', 4, 'wildcard_and_policy_scope', wildcard, lambda text, lang: wildcard in text and ('destination' in text or 'destino' in text), True)
    # Two recursive dependencies without a connected/independent anchor cannot resolve.
    dependencies = {'A': 'B', 'B': 'A'}
    def resolves(node, seen):
        if node in seen:
            return False
        if node not in dependencies:
            return node == 'connected'
        return resolves(dependencies[node], seen | {node})
    assert not resolves('A', set()) and not resolves('B', set())
    original = json.loads((ROOT / 'original_20261024_b03_50.json').read_text())['questions'][20]
    correct = sorted(option['optionLabel'] for option in original['options'] if option['isCorrect'])
    assert correct == ['A']
    assert 'no resolvable forwarding anchor' in original['options'][0]['optionTextEn']
    assert 'carece de un punto de reenvío resoluble' in original['options'][0]['optionTextEs']
    records.append({'id': original['id'], 'kind': 'recursive_dependency_cycle', 'result': {'AResolves': False, 'BResolves': False}, 'expectedCorrectLabels': ['A'], 'passed': True})
    return {'checked': len(records), 'records': records, 'scope': 'Only these explicitly inspected scenarios; technical/source review is separate.'}


if __name__ == '__main__':
    print(json.dumps(review(), ensure_ascii=False, indent=2))
