#!/usr/bin/env python3
"""Independent checks for explicitly reviewed fourth-batch scenarios, not IOS emulation."""
import ipaddress as ip
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'server/prisma/questions'


def review():
    original = json.loads((ROOT / 'batch4_all.json').read_text())['questions']
    revised = {q['supersedesQuestionId']: q for q in json.loads((ROOT / 'reviewed_batch4_corrections_20261030.json').read_text())['questions']}
    records = []

    def case(n, kind, result, predicate):
        parent = f'ccna-legacy-batch4_all-{n:03}'
        q = revised.get(parent, original[n - 1])
        expected = None
        for lang in ['En', 'Es']:
            labels = sorted(o['optionLabel'] for o in q['options'] if predicate(o['optionText' + lang]))
            actual = sorted(o['optionLabel'] for o in q['options'] if o['isCorrect'])
            if not labels or labels != actual or (expected is not None and labels != expected):
                raise ValueError(f'{parent}: derived {lang} key {labels} != {actual}')
            expected = labels
        records.append({'id': q.get('id', parent), 'kind': kind, 'result': result,
                        'expectedCorrectLabels': expected, 'passed': True})

    # The question explicitly supplies a full-MaxAge wait followed by two forward delays.
    timers = {'hello': 2, 'forwardDelay': 15, 'maxAge': 20}
    total = timers['maxAge'] + 2 * timers['forwardDelay']
    assert total == 50
    case(16, 'scoped_stp_timer_sum', {**timers, 'totalSeconds': total},
         lambda t: bool(re.search(r'\b50\b', t)) and all(str(v) + 's' in t for v in timers.values()))

    candidates = {'Static': 1, 'eBGP': 20, 'EIGRP': 90, 'OSPF': 110}
    winner = min(candidates, key=candidates.get)
    case(21, 'same_prefix_ad_selection', {'winner': winner, 'distance': candidates[winner]},
         lambda t: bool(re.search(r'AD = 1\)', t)))

    costs = [max(1, 10000 // speed) for speed in [10000, 1000]]
    assert costs == [1, 10]
    case(25, 'ospf_reference_bandwidth_ratio', {'referenceMbps': 10000, 'costs': costs},
         lambda t: 'auto-cost reference-bandwidth 10000' in t)

    q = revised['ccna-legacy-batch4_all-027']
    for lang in ['En', 'Es']:
        text = q['statement' + lang]
        assert re.search(r'Maximum path\s*:\s*4', text, re.I)
        assert re.search(r'(?:Router ID|Routing Process.*ID)\s*:?\s*10\.254\.254\.1', text, re.I)
    case(27, 'parsed_protocol_summary', {'maximumPaths': 4, 'routerId': '10.254.254.1'},
         lambda t: '4;' in t and '10.254.254.1' in t)

    # Resolve using the exhibit, then derive the Ethernet neighbor from its connected subnet.
    q = original[27]
    expected = None
    for lang in ['En', 'Es']:
        routes = []
        for line in q['statement' + lang].splitlines():
            match = re.search(r'([\d.]+/\d+).*?(?:via ([\d.]+)|directly connected, (GigabitEthernet[\d/]+))', line)
            if match:
                network, hop, interface = match.groups()
                routes.append((ip.ip_network(network), hop, interface))
        address = ip.ip_address('10.50.15.22')
        hops = []
        for _ in range(8):
            network, hop, interface = max((r for r in routes if address in r[0]), key=lambda r: r[0].prefixlen)
            if interface:
                break
            hops.append(hop)
            address = ip.ip_address(hop)
        else:
            raise ValueError('Unresolved recursion')
        result = {'nextHops': hops, 'interface': interface, 'ethernetNeighbor': str(address)}
        assert result == {'nextHops': ['192.168.12.2', '172.16.1.2'], 'interface': 'GigabitEthernet0/0', 'ethernetNeighbor': '172.16.1.2'}
        assert expected is None or expected == result
        expected = result
    case(28, 'parsed_recursive_route_chain', expected,
         lambda t: all(hop in t for hop in expected['nextHops']) and expected['interface'] in t)

    q = original[29]
    for lang in ['En', 'Es']:
        prefixes = [ip.ip_network(x) for x in re.findall(r'([0-9a-f:]+/\d+)', q['statement' + lang], re.I) if ':' in x]
        address = ip.ip_address('2001:db8:acad:1:1000:0:0:55')
        best = max((p for p in prefixes if address in p), key=lambda p: p.prefixlen)
        assert str(best) == '2001:db8:acad:1:1000::/80'
    case(30, 'parsed_ipv6_longest_prefix', {'prefix': str(best), 'destination': str(address)},
         lambda t: str(best).upper() in t.upper() and 'GigabitEthernet0/2' in t)

    synthesized = ip.ip_address(int(ip.ip_address('64:ff9b::')) | int(ip.ip_address('198.51.100.25')))
    assert str(synthesized) == '64:ff9b::c633:6419'
    q = original[33]
    assert all('198.51.100.25' in q['explanation' + lang] and str(synthesized) in q['explanation' + lang] for lang in ['En', 'Es'])
    case(34, 'dns64_well_known_prefix_embedding', {'ipv4': '198.51.100.25', 'ipv6': str(synthesized)},
         lambda t: 'DNS64' in t and 'AAAA' in t)
    return {'checked': len(records), 'records': records,
            'scope': 'Explicit reviewed inputs only; documentary review is separate; no IOS runtime is claimed.'}


if __name__ == '__main__':
    print(json.dumps(review(), ensure_ascii=False, indent=2))
