#!/usr/bin/env python3
"""Independent arithmetic checks; does not approve protocol claims or translations."""
import argparse
import ipaddress
import json
import math
from pathlib import Path


def calculate(proof, question):
    kind = proof['kind']
    if kind in ('network', 'broadcast', 'point_to_point', 'address_count'):
        network = ipaddress.ip_network(proof['cidr'], strict=False)
        if kind == 'network': return str(network.network_address)
        if kind == 'broadcast': return str(network.broadcast_address)
        if kind == 'address_count': return str(network.num_addresses)
        return ', '.join(map(str, network.hosts()))
    if kind == 'networks_overlap':
        networks = [ipaddress.ip_network(n) for n in proof['networks']]
        return ('The allocations overlap; the /24 lies inside the /23' if networks[0].overlaps(networks[1])
                else 'They are disjoint because their written network addresses differ')
    if kind == 'vlsm_allocate':
        parent = ipaddress.ip_network(proof['parent'])
        cursor = int(parent.network_address)
        allocations = []
        for hosts in proof['hosts']:
            host_bits = (hosts + 1).bit_length()
            size = 1 << host_bits
            start = (cursor + size - 1) // size * size
            subnet = ipaddress.ip_network((start, 32 - host_bits))
            if not subnet.subnet_of(parent): raise ValueError('Allocation exceeds parent')
            allocations.append(str(subnet))
            cursor = int(subnet.broadcast_address) + 1
        return '; '.join(allocations)
    if kind == 'decimal_megabytes_per_second': return f"{proof['bits_per_second'] / 8 / 1000000:g} MB/s"
    if kind == 'switch_flood':
        return [port for port, vlans in proof['ports'].items() if port != proof['ingress'] and proof['vlan'] in vlans]
    if kind == 'port_id_minimum': return min(proof['port_ids'], key=lambda value: tuple(map(int, value.split('.'))))
    if kind == 'maximum_priority': return max(proof['priorities'], key=proof['priorities'].get)
    if kind == 'graph_shortest_path':
        import heapq
        graph = {}
        for a, b, cost in proof['edges']:
            if cost <= 0: raise ValueError('Costs must be positive')
            graph.setdefault(a, []).append((b, cost)); graph.setdefault(b, []).append((a, cost))
        heap = [(0, (proof['start'],))]
        distances = {}
        while heap:
            distance, path = heapq.heappop(heap)
            node = path[-1]
            if node == proof['end']: return ' -> '.join(path)
            if node in distances and distances[node] <= distance: continue
            distances[node] = distance
            for neighbor, cost in graph.get(node, []):
                if neighbor not in path: heapq.heappush(heap, (distance + cost, path + (neighbor,)))
        return 'No path remains'
    if kind == 'ntp_delay':
        t1, t2, t3, t4 = proof['timestamps']
        return f"{(t4 - t1) - (t3 - t2):g} ms"
    if kind == 'json_array_lookup': return str(proof['payload'][proof['array']][proof['index']][proof['field']])
    if kind == 'link_utilization':
        if proof['capacity_bps'] <= 0 or proof['traffic_bps'] < 0: raise ValueError('Invalid link rates')
        return f"{proof['traffic_bps'] / proof['capacity_bps'] * 100:g}%"
    if kind == 'integer_range_labels':
        return [o['optionTextEn'] for o in question['options']
                if proof['minimum'] <= int(o['optionTextEn'].split()[0]) <= proof['maximum']]
    if kind == 'dns_wildcard':
        suffix = proof['suffix'].lower().split('.')
        matches = []
        for option in question['options']:
            labels = option['optionTextEn'].lower().split('.')
            if len(labels) == len(suffix) + 1 and labels[0] and labels[1:] == suffix:
                matches.append(option['optionTextEn'])
        return matches
    if kind == 'minimum_padding': return str(max(0, proof['minimum'] - proof['payload']))
    if kind == 'tcp_header_length': return f"{proof['words'] * 4} bytes"
    if kind == 'budget_count':
        if proof['per_device'] <= 0: raise ValueError('Invalid device allocation')
        return str(proof['budget'] // proof['per_device'])
    if kind == 'vlan_set_add':
        allowed = (set(proof['current']) | set(proof['added'])) - set(proof.get('exclude', []))
        return [o['optionTextEn'] for o in question['options'] if int(o['optionTextEn'].split()[-1]) in allowed]
    if kind == 'equal_minimum_paths':
        costs = {name: sum(links) for name, links in proof['paths'].items()}
        return [name for name, cost in costs.items() if cost == min(costs.values())]
    if kind == 'ospf_router_id':
        candidates = proof['loopbacks'] or proof['physical']
        return str(max(map(ipaddress.IPv4Address, candidates)))
    if kind == 'counter_delta': return str((proof['current'] - proof['previous']) % (1 << proof['bits']))
    if kind == 'totp_counter':
        if proof['step'] <= 0: raise ValueError('Invalid TOTP step')
        return str((proof['unix_time'] - proof['epoch']) // proof['step'])
    if kind == 'json_boolean_field':
        results = []
        for option in question['options']:
            try:
                payload = json.loads(option['optionTextEn'])
                if isinstance(payload, dict) and type(payload.get(proof['field'])) is bool and payload[proof['field']] == proof['value']:
                    results.append(option['optionTextEn'])
            except json.JSONDecodeError: pass
        return results
    if kind == 'bipartite_links': return str(proof['leaves'] * proof['spines'])
    if kind == 'path_hops': return str(max(0, len(proof['nodes']) - 1))
    if kind == 'dbm_power_ratio': return f"{10 ** ((proof['a'] - proof['b']) / 10):g}"
    if kind == 'oversubscription':
        capacity = proof['uplinks'] * proof['uplink_rate']
        if capacity <= 0: raise ValueError('Invalid uplink capacity')
        return f"{proof['access_ports'] * proof['access_rate'] / capacity:g}:1"
    if kind == 'minimum_seconds': return f"{min(proof['values'])} seconds"
    if kind == 'allocation_product': return str(proof['addresses'] * proof['ports'])
    if kind == 'alert_precision':
        total = proof['true_alerts'] + proof['false_alerts']
        if total <= 0: raise ValueError('Precision requires at least one alert')
        return f"{proof['true_alerts'] / total * 100:g}%"
    if kind == 'time_savings': return f"{sum(proof['daily_minutes']) * proof['days']} minutes"
    if kind == 'tcp_ack': return str((proof['sequence'] + proof['data_bytes'] + int(proof['syn']) + int(proof['fin'])) % (2**32))
    if kind == 'tcp_window': return f"{min(proof['congestion_kib'], proof['receive_kib']) * 1024} bytes"
    if kind == 'udp_payload': return str(proof['udp_length'] - 8)
    if kind == 'ipv4_payload': return str(proof['total_length'] - proof['ihl'] * 4)
    if kind == 'dscp_ecn':
        if not 0 <= proof['dscp'] <= 63 or not 0 <= proof['ecn'] <= 3: raise ValueError('Invalid DS field values')
        return str((proof['dscp'] << 2) | proof['ecn'])
    if kind == 'ip_set_membership':
        networks = [ipaddress.ip_network(n) for n in proof['networks']]
        return [o['optionTextEn'] for o in question['options'] if any(ipaddress.ip_address(o['optionTextEn']) in n for n in networks)]
    if kind == 'stp_designated':
        return min(proof['candidates'], key=lambda c: (c['root_cost'], c['bridge_priority'], int(c['mac'].replace(':', ''), 16)))['name']
    if kind == 'snr': return f"{proof['signal_dbm'] - proof['noise_dbm']:g} dB"
    if kind == 'passive_interface_exception': return [name for name in proof['interfaces'] if name in proof['exceptions']]
    if kind == 'lowest_distance':
        winners = [name for name, distance in proof['routes'].items() if distance == min(proof['routes'].values())]
        if len(winners) != 1: raise ValueError('Distance comparison did not produce one winner')
        return winners[0]
    if kind == 'ipv6_mac':
        tail = int(ipaddress.IPv6Address(proof['address'])) & 0xffffffff
        return '33:33:' + ':'.join(f'{byte:02x}' for byte in tail.to_bytes(4, 'big'))
    if kind == 'exact_summary_possible':
        networks = list(ipaddress.collapse_addresses([ipaddress.ip_network(n) for n in proof['networks']]))
        return 'No; an exact representation requires more than one prefix' if len(networks) > 1 else 'Yes; an exact representation needs one prefix'
    if kind == 'lsa_sequence':
        def signed(value):
            number = int(value, 16)
            return number if number < 2**31 else number - 2**32
        return max(proof['values'], key=lambda name: signed(proof['values'][name]))
    if kind == 'ttl_remaining': return f"{max(0, proof['ttl'] - proof['elapsed'])} seconds"
    if kind == 'serialization': return f"{proof['bytes'] * 8 / proof['bits_per_second'] * 1000:g} ms"
    if kind == 'static_nat': return proof['mappings'][proof['destination']]
    if kind == 'service_acl':
        permitted = []
        for packet in proof['packets']:
            action = 'deny'
            for rule in proof['rules']:
                if packet['protocol'] == rule['protocol'] and packet['destination_port'] == rule['destination_port']:
                    action = rule['action']; break
            if action == 'permit': permitted.append(packet['name'])
        return permitted
    if kind == 'json_integer_field':
        valid = []
        for option in question['options']:
            try:
                payload = json.loads(option['optionTextEn'])
                if isinstance(payload, dict) and type(payload.get(proof['field'])) in (int, float) and payload[proof['field']] == proof['value']: valid.append(option['optionTextEn'])
            except json.JSONDecodeError: pass
        return valid
    if kind == 'solicited_node': return str(ipaddress.IPv6Address(int(ipaddress.IPv6Address('ff02::1:ff00:0')) | (int(ipaddress.IPv6Address(proof['address'])) & 0xffffff)))
    if kind == 'eui64':
        parts = bytes.fromhex(proof['mac'].replace(':', ''))
        value = bytes([parts[0] ^ 2]) + parts[1:3] + bytes.fromhex('fffe') + parts[3:]
        return ':'.join(f'{int.from_bytes(value[i:i+2], "big"):04x}' for i in range(0, 8, 2))
    if kind == 'mss': return str(proof['mtu'] - proof['ip_header'] - proof['tcp_header'])
    if kind == 'fragment_offset': return str(proof['offset'] * 8)
    if kind == 'multicast_mac_matches':
        results = []
        for option in question['options']:
            address = ipaddress.IPv4Address(option['optionTextEn'])
            n = int(address)
            mac = f'01:00:5e:{(n >> 16) & 0x7f:02x}:{(n >> 8) & 0xff:02x}:{n & 0xff:02x}'
            if address.is_multicast and mac == proof['mac']: results.append(option['optionTextEn'])
        return results
    if kind == 'path_cost':
        costs = {name: sum(links) for name, links in proof['paths'].items()}
        winners = [name for name, cost in costs.items() if cost == min(costs.values())]
        if len(winners) != 1: raise ValueError('Expected a unique shortest path')
        return winners[0]
    if kind == 'dhcp_timers': return f"T1={proof['lease_hours'] * .5:g} hours; T2={proof['lease_hours'] * .875:g} hours"
    if kind == 'increment': return str(proof['value'] + 1)
    if kind == 'oid_next':
        key = lambda oid: tuple(map(int, oid.split('.')))
        return min((oid for oid in proof['candidates'] if key(oid) > key(proof['start'])), key=key)
    if kind == 'wildcard_matches':
        base = int(ipaddress.IPv4Address(proof['base']))
        mask = int(ipaddress.IPv4Address(proof['wildcard'])) ^ 0xffffffff
        return [o['optionTextEn'] for o in question['options'] if (int(ipaddress.IPv4Address(o['optionTextEn'])) ^ base) & mask == 0]
    if kind == 'trunk_intersection':
        common = set(proof['end_a']) & set(proof['end_b'])
        return [o['optionTextEn'] for o in question['options'] if int(o['optionTextEn'].split()[-1]) in common]
    if kind == 'integer_range': return [o['optionTextEn'] for o in question['options'] if proof['minimum'] <= int(o['optionTextEn']) <= proof['maximum']]
    if kind == 'minimum_prefix': return '/' + str(32 - (proof['hosts'] + 1).bit_length())
    if kind == 'wildcard': return str(ipaddress.IPv4Address(int(ipaddress.IPv4Address(proof['mask'])) ^ 0xffffffff))
    if kind == 'subprefix_count': return str(2 ** (proof['child'] - proof['parent']))
    if kind == 'ipv6_compress': return ipaddress.IPv6Address(proof['address']).compressed
    if kind == 'fragmentation':
        size = (proof['mtu'] - proof['header']) // 8 * 8
        count = math.ceil(proof['payload'] / size)
        return f"{count} fragments, {proof['payload'] - size * (count - 1)} bytes"
    if kind == 'mac_bits':
        values = [o['optionTextEn'] for o in question['options'] if int(o['optionTextEn'].split(':')[0], 16) & 3 == 2]
        if len(values) != 1: raise ValueError('Expected one local unicast MAC')
        return values[0]
    if kind == 'stp_priority': return min(proof['bridges'], key=lambda b: (b[1], int(b[2].replace(':', ''), 16)))[0]
    if kind == 'ratio': return f"{proof['numerator'] / proof['denominator']:g}"
    if kind == 'minimum': return str(min(proof['values']))
    if kind == 'id_space': return str(2 ** proof['bits'] - proof['reserved'])
    if kind == 'longest_prefix':
        dest = ipaddress.ip_address(proof['destination'])
        matches = [ipaddress.ip_network(route) for route in proof['routes'] if dest in ipaddress.ip_network(route)]
        return str(max(matches, key=lambda route: route.prefixlen)) + proof.get('suffix', '')
    if kind == 'aggregate':
        networks = list(ipaddress.collapse_addresses([ipaddress.ip_network(route) for route in proof['routes']]))
        if len(networks) != 1: raise ValueError('Prefixes do not form one exact summary')
        return str(networks[0])
    if kind == 'ipv6_default': return str(ipaddress.IPv6Network((0, 0)))
    if kind == 'ospf_dr': return max((r for r in proof['routers'] if r[1] > 0), key=lambda r: (r[1], int(ipaddress.IPv4Address(r[2]))))[0]
    if kind == 'ntp_offset':
        t1, t2, t3, t4 = proof['timestamps']
        return f'{((t2-t1)+(t3-t4))/2:+g} ms'
    if kind == 'syslog_pri': return str(proof['facility'] * 8 + proof['severity'])
    if kind == 'acl':
        for action, prefix in proof['rules']:
            if ipaddress.ip_address(proof['source']) in ipaddress.ip_network(prefix): return action.capitalize()
        return 'Implicit deny'
    if kind == 'acl_range':
        base = int(ipaddress.IPv4Address(proof['base']))
        wildcard = int(ipaddress.IPv4Address(proof['wildcard']))
        if wildcard & (wildcard + 1): raise ValueError('Noncontiguous wildcard requires another checker')
        first = base & (~wildcard & 0xffffffff)
        return f'{ipaddress.IPv4Address(first)}–{ipaddress.IPv4Address(first | wildcard)}'
    if kind == 'json_validity':
        valid = []
        for option in question['options']:
            try:
                if isinstance(json.loads(option['optionTextEn']), dict): valid.append(option['optionTextEn'])
            except json.JSONDecodeError: pass
        if len(valid) != 1: raise ValueError('Expected exactly one valid JSON object')
        return valid[0]
    raise ValueError('Unsupported calculation kind: ' + kind)


def check_batch(path):
    batch = json.loads(Path(path).read_text())
    records = []
    for question in batch['questions']:
        proof = question.get('verification', {}).get('calculation')
        if not proof:
            records.append({'id': question['id'], 'calculation': 'not_applicable', 'technicalReview': 'pending'})
            continue
        expected = calculate(proof, question)
        expected_values = set(expected if isinstance(expected, list) else [expected])
        matches = [o for o in question['options'] if o['optionTextEn'] in expected_values]
        selected = [o for o in question['options'] if o['isCorrect']]
        if not expected_values or len(matches) != len(expected_values) or {o['optionLabel'] for o in selected} != {o['optionLabel'] for o in matches}:
            raise ValueError(f"{question['id']}: answer key does not match independent result {expected!r}")
        records.append({'id': question['id'], 'calculation': 'passed', 'kind': proof['kind'], 'result': expected, 'technicalReview': 'pending'})
    return {'batchId': batch['batchId'], 'received': len(records), 'independentChecksPassed': sum(r['calculation'] == 'passed' for r in records), 'technicalApprovals': 0, 'records': records}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('batch')
    parser.add_argument('--output')
    args = parser.parse_args()
    report = check_batch(args.batch)
    output = json.dumps(report, indent=2, ensure_ascii=False) + '\n'
    if args.output: Path(args.output).write_text(output)
    else: print(output, end='')
