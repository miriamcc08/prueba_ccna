#!/usr/bin/env python3
"""Recompute ten explicitly reviewed legacy scenarios; this is not a general approval engine."""
import ipaddress as ip
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1] / 'server/prisma/questions'


def review():
    originals = json.loads((ROOT / 'batch3_all.json').read_text())['questions']
    revised = {q['supersedesQuestionId']: q for q in json.loads((ROOT / 'reviewed_batch3_corrections_20261029.json').read_text())['questions']}
    records = []

    def case(number, kind, result, predicate):
        parent = f'ccna-legacy-batch3_all-{number:03}'
        q = revised.get(parent, originals[number - 1])
        selected = []
        for language in ['En', 'Es']:
            labels = sorted(o['optionLabel'] for o in q['options'] if predicate(o['optionText' + language], language))
            actual = sorted(o['optionLabel'] for o in q['options'] if o['isCorrect'])
            if not labels or labels != actual or (selected and labels != selected):
                raise ValueError(f'{parent}: {language} derived labels {labels} disagree with {actual}')
            selected = labels
        records.append({'id': q.get('id', parent), 'kind': kind, 'result': result, 'expectedCorrectLabels': selected, 'passed': True})

    # Enumerate both simple paths rather than choose by number of physical hops.
    graph = {1: {2: 4, 3: 19}, 2: {1: 4, 3: 4}, 3: {1: 19, 2: 4}}
    def paths(node, seen):
        if node == 1:
            return [(0, [1])]
        return [(cost + remaining, [node] + path) for other, cost in graph[node].items() if other not in seen
                for remaining, path in paths(other, seen | {other})]
    cost, path = min(paths(3, {3}))
    assert cost == 8 and path == [3, 2, 1]
    case(15, 'stp_enumerated_paths', {'path': path, 'cost': cost}, lambda t, lang: 'Switch 2' in t and re.search(r'\b8\b', t))

    modes = [('active', 'active'), ('active', 'passive'), ('passive', 'passive'), ('desirable', 'auto')]
    valid = [pair for pair in modes if set(pair) <= {'active', 'passive'} and 'active' in pair]
    case(20, 'lacp_mode_pairs', [list(pair) for pair in valid],
         lambda t, lang: tuple(re.findall(r"'(active|passive|desirable|auto)'", t)) in valid)

    subnets = [ip.ip_network('10.1.0.0/24'), ip.ip_network('10.2.0.0/24')]
    summaries = [str(network.supernet(new_prefix=8)) for network in subnets]
    assert summaries == ['10.0.0.0/8'] * 2 and subnets[0] != subnets[1]
    case(22, 'discontiguous_summary_information_loss', {'specific': list(map(str, subnets)), 'summaries': summaries},
         lambda t, lang: '10.0.0.0/8' in t and '/24' in t)

    # Derive Ethernet source/destination from the stated WAN interfaces.
    q = revised['ccna-legacy-batch3_all-029']
    tuples = []
    for language in ['En', 'Es']:
        statement = q['statement' + language]
        macs = re.findall(r'MAC ([0-9a-f]{4}(?:\.[0-9a-f]{4}){2})', statement, re.I)
        assert len(macs) == 6 and all(int(mac[:2], 16) & 1 == 0 for mac in macs)
        ips = re.findall(r'(?<![\d.])(?:\d{1,3}\.){3}\d{1,3}(?![\d.])', statement)
        # Host endpoints are listed first; then LAN/WAN interfaces of R1 and R2.
        tuples.append([macs[3], macs[4], ips[0], ips[1]])
    assert tuples[0] == tuples[1] == ['2222.2222.2222', '3233.3333.3333', '10.1.1.50', '10.2.2.80']
    case(29, 'ethernet_rewrite_and_unicast_bits', tuples[0], lambda t, lang: all(value in t for value in tuples[0]))

    q = originals[30]
    winners = []
    for language in ['En', 'Es']:
        routes = []
        for line in q['statement' + language].splitlines():
            match = re.search(r'([\d.]+/\d+).*?via ([\d.]+).*?(GigabitEthernet[\d/]+)', line)
            if match:
                prefix, hop, interface = match.groups()
                network = ip.ip_network(prefix)
                if ip.ip_address('10.1.4.150') in network:
                    routes.append((network, hop, interface))
        winners.append(tuple(map(str, max(routes, key=lambda item: item[0].prefixlen))))
    assert winners[0] == winners[1]
    prefix, hop, interface = winners[0]
    case(31, 'parsed_longest_prefix', {'prefix': prefix, 'nextHop': hop, 'interface': interface}, lambda t, lang: prefix in t and hop in t)

    candidates = [('R1', 1, '10.1.1.1'), ('R2', 10, '10.2.2.2'), ('R3', 0, '10.3.3.3'), ('R4', 5, '10.4.4.4')]
    eligible = sorted((x for x in candidates if x[1] > 0), key=lambda x: (x[1], int(ip.ip_address(x[2]))), reverse=True)
    dr, bdr = eligible[0][0], eligible[1][0]
    case(32, 'fresh_ospf_election', {'DR': dr, 'BDR': bdr, 'ineligible': ['R3']},
         lambda t, lang: bool(re.search(dr + r' (?:is elected|es elegido) DR', t) and re.search(bdr + r' (?:is elected|es elegido) BDR', t)))

    pool = int(ip.ip_address('203.0.113.25')) - int(ip.ip_address('203.0.113.1')) + 1
    assert pool == 25 < 150
    case(34, 'one_to_one_nat_capacity', {'addresses': pool, 'workstations': 150, 'shortfall': 150 - pool}, lambda t, lang: "'overload'" in t)
    levels = [0]
    for _ in range(2):
        levels.append(levels[-1] + 1)
    case(37, 'ntp_synchronization_levels', levels, lambda t, lang: list(map(int, re.findall(r'Stratum (\d+)', t))) == levels)

    # First expiry is at 10 min only if there is no subsequent frame from that MAC.
    arrivals, interval, expires = [0, 4, 9], 10, 0
    for arrival in arrivals:
        assert arrival <= expires or arrival == 0
        expires = arrival + interval
    assert expires == 19
    case(43, 'secure_mac_inactivity_timeline', {'frameMinutes': arrivals, 'ageMinutes': interval, 'expiresAtMinute': expires},
         lambda t, lang: '10' in t and ('no traffic' in t or 'sin tráfico' in t))

    q = revised['ccna-legacy-batch3_all-048']
    payloads = []
    for language in ['En', 'Es']:
        literal = next(line for line in q['statement' + language].splitlines() if line.startswith('{"ietf-interfaces:interface"'))
        value = json.loads(literal)
        assert isinstance(value, dict) and isinstance(value['ietf-interfaces:interface'], list)
        payloads.append(value['ietf-interfaces:interface'][0]['oper-status'])
        assert 'verify=False' not in q['statement' + language]
    assert payloads == ['up', 'up']
    case(48, 'restconf_yang_list_json', {'decodedType': 'dict', 'interfaceType': 'list', 'operStatus': payloads[0]},
         lambda t, lang: 'Accept' in t and 'response.json()' in t and ('dictionary' in t or 'diccionario' in t))
    return {'checked': len(records), 'records': records, 'scope': 'Explicitly reviewed inputs only; source review is separate and this does not emulate IOS.'}


if __name__ == '__main__':
    print(json.dumps(review(), ensure_ascii=False, indent=2))
