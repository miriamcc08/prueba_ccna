import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

describe('Legacy bank review', () => {
  it('independently derives bilingual keys for nineteen reviewed arithmetic and protocol scenarios', () => {
    const report = JSON.parse(execFileSync('python3', [resolve(__dirname, '../../tools/check-reviewed-legacy-scenarios.py')], { encoding: 'utf8' }));
    expect(report.checked).toBe(19);
    expect(report.records.every((row: any) => row.passed)).toBe(true);
    expect(report.records.find((row: any) => row.kind === 'modified_eui64').result).toBe('2001:db8:acad:1:250:56ff:febe:341a');
    expect(report.records.find((row: any) => row.kind === 'ordered_acl').result).toEqual({ sequence: 30, action: 'deny' });
    expect(report.records.find((row: any) => row.kind === 'recursive_dependency_cycle').result).toEqual({ AResolves: false, BResolves: false });
  });
  it('derives ten third-batch scenarios including valid MAC bits, YANG arrays and a fresh OSPF election', () => {
    const report = JSON.parse(execFileSync('python3', [resolve(__dirname, '../../tools/check-reviewed-batch3-scenarios.py')], { encoding: 'utf8' }));
    expect(report.checked).toBe(10);
    expect(report.records.every((row: any) => row.passed)).toBe(true);
    expect(report.records.find((row: any) => row.kind === 'fresh_ospf_election').result).toEqual({ DR: 'R2', BDR: 'R4', ineligible: ['R3'] });
    expect(report.records.find((row: any) => row.kind === 'restconf_yang_list_json').result.operStatus).toBe('up');
    expect(report.records.find((row: any) => row.kind === 'ethernet_rewrite_and_unicast_bits').result).toEqual(['2222.2222.2222', '3233.3333.3333', '10.1.1.50', '10.2.2.80']);
  });
  it('derives seven fourth-batch scenarios from bilingual inputs and recursive route exhibits', () => {
    const report = JSON.parse(execFileSync('python3', [resolve(__dirname, '../../tools/check-reviewed-batch4-scenarios.py')], { encoding: 'utf8' }));
    expect(report.checked).toBe(7);
    expect(report.records.every((row: any) => row.passed)).toBe(true);
    expect(report.records.find((row: any) => row.kind === 'scoped_stp_timer_sum').result.totalSeconds).toBe(50);
    expect(report.records.find((row: any) => row.kind === 'parsed_recursive_route_chain').result).toEqual({ nextHops: ['192.168.12.2', '172.16.1.2'], interface: 'GigabitEthernet0/0', ethernetNeighbor: '172.16.1.2' });
    expect(report.records.find((row: any) => row.kind === 'parsed_ipv6_longest_prefix').result.prefix).toBe('2001:db8:acad:1:1000::/80');
  });
  it('derives ten sixth-batch keys including unique IPv6 alternatives and actual Python subscript outcomes', () => {
    const report = JSON.parse(execFileSync('python3', [resolve(__dirname, '../../tools/check-reviewed-batch6-scenarios.py')], { encoding: 'utf8' }));
    expect(report.checked).toBe(10);
    expect(report.records.every((row: any) => row.passed)).toBe(true);
    expect(report.records.find((row: any) => row.kind === 'modified_eui64_unique_alternatives').result).toBe('2001:db8:acad:10:250:56ff:fea3:8c1f');
    expect(report.records.find((row: any) => row.kind === 'parsed_json_python_subscripts').result).toEqual({ A: '10.10.20.1', B: '10.10.20.2', C: 'TypeError', D: 'KeyError' });
    expect(report.records.find((row: any) => row.kind === 'stateless_established_flag_mask').result).toEqual({ 0: false, 2: false, 4: true, 16: true, 18: true, 20: true });
  });
  it('checks the HTTP fixture and binds the executed Ansible YAML check to both languages', () => {
    const report = JSON.parse(execFileSync('python3', [resolve(__dirname, '../../tools/check-reviewed-automation-scenarios.py')], { encoding: 'utf8' }));
    expect(report.checked).toBe(2);
    expect(report.records.find((row: any) => row.kind === 'http_excerpt_json_consistency').result).toEqual({ status: 401, errorCode: 'AUTH_TOKEN_EXPIRED' });
    const yaml = report.records.find((row: any) => row.kind === 'bound_yaml_argument_check_artifact').result;
    expect(yaml.moduleOrder).toEqual(['cisco.ios.ios_ntp_global', 'cisco.ios.ios_system']);
    expect(yaml.tasks).toBe(2);
    expect(yaml.bilingualYamlIdentical).toBe(true);
  });
  it('recomputes fifth-batch routing/STP/ACL and executes both RESTCONF snippets with mocked transport', () => {
    const report = JSON.parse(execFileSync('python3', [resolve(__dirname, '../../tools/check-reviewed-batch5-scenarios.py')], { encoding: 'utf8' }));
    expect(report.passed).toBe(true);
    expect(report.records).toHaveLength(7);
    expect(report.records.find((row: any) => row.kind === 'cumulative_ack_two_out_of_order_segments').result).toEqual({ duplicateAcks: 2, fastRetransmitThreshold: 3, thresholdReached: false });
    expect(report.records.find((row: any) => row.kind === 'stp_sender_bid_with_equal_total_cost').result).toEqual({ port: 'Gi0/2', rootCost: 8 });
    expect(report.records.find((row: any) => row.kind === 'executed_bilingual_restconf_fixture_no_network').result.printed).toEqual(['Administratively enabled: Gi0/2 - Type: iana-if-type:ethernetCsmacd']);
  });
  it('checks eleven legacy arithmetic keys and the numerical Spanish alternatives independently', () => {
    const report = JSON.parse(execFileSync('python3', [resolve(__dirname, '../../tools/review-legacy-calculations.py')], { encoding: 'utf8' }));
    expect(report.arithmeticChecksPassed).toBe(11);
    expect(report.fullTechnicalApprovals).toBe(0);
    expect(report.legacySingleAnswerKeys.A).toBe(266);
  });
  it('groups equivalent summaries instead of treating IP substitutions as distinct families', () => {
    const report = JSON.parse(execFileSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'prisma/audit-questions.ts'], { encoding: 'utf8' }));
    expect(report.received).toBe(869);
    expect(report.rejected).toBe(0);
    expect(report.duplicates).toBe(0);
    expect(report.editorialReview).toEqual({ integrity: 'verified', summary: { validated: 619, pending_review: 41, rejected: 209 } });
    const family = report.equivalentFamilies.find((g: any) => g.family === 'concept-ipv4-route-aggregation');
    expect(family.records).toEqual(expect.arrayContaining([
      { file: 'batch3_all.json', index: 8 }, { file: 'batch4_all.json', index: 6 },
      { file: 'batch6_all.json', index: 1 }, { file: 'original_20261024_50.json', index: 26 },
    ]));
    expect(report.distinctDeclaredFamilies).toBeLessThan(report.received);
    expect(report.uniqueNormalizedEnglishStatements).toBe(869);
  });
  it('classifies link-local scope as IPv6 addressing rather than subnet arithmetic', () => {
    const data = JSON.parse(readFileSync(resolve(__dirname, '../prisma/questions/batch2_network_fundamentals.json'), 'utf8'));
    expect(data.questions[7].questionType).toBe('ipv6_addressing');
  });
});
