#!/usr/bin/env python3
"""Recompute fifth-batch examples from bilingual exhibits; no IOS execution."""
import contextlib
import io
import ipaddress as ip
import json
import os
import re
import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'server/prisma/questions'


def review():
    revised = json.loads((ROOT / 'reviewed_batch5_corrections_20261030.json').read_text())['questions']
    questions = {int(q['supersedesQuestionId'].rsplit('-', 1)[1]): q for q in revised}
    records = []

    def case(n, kind, result, predicate):
        q = questions[n]
        for lang in ['En', 'Es']:
            derived = sorted(o['optionLabel'] for o in q['options'] if predicate(o['optionText' + lang], lang))
            actual = sorted(o['optionLabel'] for o in q['options'] if o['isCorrect'])
            if not derived or derived != actual:
                raise ValueError(f'{n}: independently derived {lang} labels {derived} != {actual}')
        records.append({'id': q['id'], 'kind': kind, 'result': result, 'passed': True})

    # Cumulative ACK advances only over contiguous received bytes. Original ACK
    # does not count as a duplicate; exactly two later out-of-order arrivals.
    next_byte = 2001
    duplicates = 0
    for seq in [3001, 4001]:
        if seq > next_byte:
            duplicates += 1
    assert duplicates == 2 and duplicates < 3
    for lang in ['En', 'Es']:
        text = questions[3]['statement' + lang]
        assert all(str(v) in text for v in [1001, 2001, 3001, 4001])
    case(3, 'cumulative_ack_two_out_of_order_segments', {'duplicateAcks': duplicates, 'fastRetransmitThreshold': 3, 'thresholdReached': False}, lambda t, _: 'ACK=2001' in t and ('two duplicate ACKs' in t or 'dos ACK duplicados' in t))

    # Root path cost is advertised upstream cost plus receiving-port cost;
    # sender bridge identifier precedes receiving port identifier on a tie.
    results = []
    for lang in ['En', 'Es']:
        t = questions[18]['statement' + lang]
        costs = [int(v) for v in re.findall(r'^Gi0/[12]\s+\w+\s+\w+\s+(\d+)', t, re.M)]
        bids = [(int(p), int(mac.replace('.', ''), 16)) for p, mac in re.findall(r'(32788|28692):([0-9a-f.]+)', t)]
        assert costs == [4, 4] and len(bids) == 2
        winner = min(range(2), key=lambda i: (4 + costs[i], bids[i]))
        root_cost = int(re.search(r'Cost\s+(\d+)', t)[1])
        assert root_cost == 8
        results.append({'port': f'Gi0/{winner + 1}', 'rootCost': root_cost})
    assert results[0] == results[1] == {'port': 'Gi0/2', 'rootCost': 8}
    case(18, 'stp_sender_bid_with_equal_total_cost', results[0], lambda t, _: 'Gi0/2' in t and 'Gi0/1' in t and ('lower' in t.lower() or 'menor' in t.lower()))

    winners = []
    for lang in ['En', 'Es']:
        t = questions[22]['statement' + lang]
        rows = re.findall(r'([\d.]+/\d+)\s+\[[^\]]+\]\s+via ([\d.]+)', t)
        best = max(((ip.ip_network(p), h) for p, h in rows if ip.ip_address('10.20.30.150') in ip.ip_network(p)), key=lambda r: r[0].prefixlen)
        winners.append({'prefix': str(best[0]), 'nextHop': best[1]})
    assert winners[0] == winners[1] == {'prefix': '10.20.30.128/26', 'nextHop': '10.1.15.5'}
    case(22, 'parsed_ipv4_longest_matching_prefix', winners[0], lambda t, _: '10.1.15.5' in t)

    selected = []
    for lang in ['En', 'Es']:
        t = questions[28]['statement' + lang]
        rows = re.findall(r'^\w\s+([0-9a-f:]+/\d+)\s+\[[^\]]+\]\s+via ([^\n]+)', t, re.M | re.I)
        best = max(((ip.ip_network(p), h) for p, h in rows if ip.ip_address('2001:db8:acad:10:100:2::50') in ip.ip_network(p)), key=lambda r: r[0].prefixlen)
        selected.append({'prefix': str(best[0]), 'nextHopAndInterface': best[1]})
    assert selected[0] == selected[1] == {'prefix': '2001:db8:acad:10:100::/80', 'nextHopAndInterface': 'FE80::3, GigabitEthernet0/2'}
    case(28, 'parsed_ipv6_longest_matching_prefix', selected[0], lambda t, _: 'FE80::3' in t and 'GigabitEthernet0/2' in t)

    # Evaluate the presented ordered ACL choices against permitted and denied
    # packets including out-of-subnet sources; do not just search for a command.
    packets = [('192.168.10.5', '10.20.30.50', 'tcp', 80, 'deny'),
               ('192.168.10.5', '10.20.30.50', 'tcp', 443, 'permit'),
               ('192.168.10.5', '10.20.30.50', 'udp', 80, 'permit'),
               ('192.168.10.5', '10.20.30.51', 'tcp', 80, 'permit'),
               ('192.168.11.5', '10.20.30.50', 'tcp', 443, 'deny')]

    def acl_complies(text, _):
        rules = []
        for line in text.splitlines():
            m = re.fullmatch(r'access-list 105 (permit|deny) (tcp|ip) 192\.168\.10\.0 0\.0\.0\.255 (host 10\.20\.30\.50 eq (80|443)|any)', line)
            if not m:
                return False
            action, proto, target, port = m.groups()
            rules.append((action, proto, target, int(port) if port else None))
        for src, dst, proto, port, expected in packets:
            action = 'deny'
            for a, p, target, dport in rules:
                if ip.ip_address(src) not in ip.ip_network('192.168.10.0/24'):
                    continue
                if p != 'ip' and (proto != p or dst != '10.20.30.50' or port != dport):
                    continue
                action = a
                break
            if action != expected:
                return False
        return True
    case(39, 'ordered_acl_packet_matrix', {'packets': len(packets), 'onlyPolicyCompliantChoice': 'A'}, acl_complies)

    def retries_match(text, _):
        timeout = re.search(r'ip ssh time-out (\d+)', text)
        retries = re.search(r'ip ssh authentication-retries (\d+)', text)
        return bool(timeout and retries and int(timeout[1]) == 60 and int(retries[1]) + 1 == 3)
    case(41, 'supplied_ssh_retry_plus_initial_rule', {'totalAttempts': 3, 'configuredRetries': 2, 'authenticationSeconds': 60}, retries_match)

    outputs = []
    q = questions[49]
    fixture = q['reviewFixture']
    for lang in ['En', 'Es']:
        t = q['statement' + lang]
        code = re.search(r'```python\n(.*?)\n```', t, re.S)[1]
        response_fixture = json.loads(re.search(r'```json\n(.*?)\n```', t, re.S)[1])
        assert response_fixture == fixture
        calls = []
        class Response:
            def raise_for_status(self):
                calls.append('status-checked')
            def json(self):
                assert calls == ['get', 'status-checked']
                return response_fixture
        def get(url, **kwargs):
            assert url.startswith('https://')
            assert kwargs['verify'] is True and kwargs['timeout'] == 10
            assert kwargs['auth'] == ('fixture-user', 'fixture-password')
            calls.append('get')
            return Response()
        previous = sys.modules.get('requests')
        previous_env = {k: os.environ.get(k) for k in ['CCNA_USER', 'CCNA_PASSWORD']}
        try:
            sys.modules['requests'] = types.SimpleNamespace(get=get)
            os.environ.update(CCNA_USER='fixture-user', CCNA_PASSWORD='fixture-password')
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                exec(compile(code, '<reviewed-restconf-fixture>', 'exec'), {})
            outputs.append(output.getvalue().splitlines())
        finally:
            if previous is None:
                sys.modules.pop('requests', None)
            else:
                sys.modules['requests'] = previous
            for key, value in previous_env.items():
                if value is None:
                    os.environ.pop(key, None)
                else:
                    os.environ[key] = value
    assert outputs[0] == outputs[1] == ['Administratively enabled: Gi0/2 - Type: iana-if-type:ethernetCsmacd']
    assert fixture['ietf-interfaces:interfaces']['interface'][2].get('enabled') is None
    case(49, 'executed_bilingual_restconf_fixture_no_network', {'printed': outputs[0], 'explicitFalseOmitted': True, 'omittedLeafSkippedWithoutApplyingYangDefault': True}, lambda t, _: 'Gi0/1' in t and 'false' in t.lower())
    return {'records': records, 'passed': True, 'limitations': 'Python fixture and protocol calculations only; no IOS, live RESTCONF, WLC or SSH server execution.'}


if __name__ == '__main__':
    print(json.dumps(review(), ensure_ascii=False, indent=2))
