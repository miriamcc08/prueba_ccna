// ============================================================
// Subnetting Calculator - Unit Tests
// Validates all deterministic network calculations
// ============================================================

import { describe, it, expect } from 'vitest';
import {
  ipToNumber,
  numberToIp,
  cidrToMask,
  maskToCidr,
  getNetworkAddress,
  getBroadcastAddress,
  getFirstHost,
  getLastHost,
  getTotalHosts,
  getUsableHosts,
  getWildcardMask,
  isValidIp,
  isValidCidr,
  getSubnetInfo,
} from '../src/utils/subnetting';

describe('Subnetting Calculator', () => {
  describe('ipToNumber / numberToIp', () => {
    it('converts 192.168.1.1 correctly', () => {
      const num = ipToNumber('192.168.1.1');
      expect(numberToIp(num)).toBe('192.168.1.1');
    });

    it('converts 0.0.0.0', () => {
      expect(ipToNumber('0.0.0.0')).toBe(0);
      expect(numberToIp(0)).toBe('0.0.0.0');
    });

    it('converts 255.255.255.255', () => {
      const num = ipToNumber('255.255.255.255');
      expect(num).toBe(4294967295);
      expect(numberToIp(num)).toBe('255.255.255.255');
    });

    it('converts 10.0.0.1', () => {
      const num = ipToNumber('10.0.0.1');
      expect(numberToIp(num)).toBe('10.0.0.1');
    });

    it('converts 172.16.0.0', () => {
      const num = ipToNumber('172.16.0.0');
      expect(numberToIp(num)).toBe('172.16.0.0');
    });
  });

  describe('cidrToMask / maskToCidr', () => {
    const testCases: [number, string][] = [
      [0, '0.0.0.0'],
      [8, '255.0.0.0'],
      [16, '255.255.0.0'],
      [24, '255.255.255.0'],
      [25, '255.255.255.128'],
      [26, '255.255.255.192'],
      [27, '255.255.255.224'],
      [28, '255.255.255.240'],
      [29, '255.255.255.248'],
      [30, '255.255.255.252'],
      [31, '255.255.255.254'],
      [32, '255.255.255.255'],
    ];

    testCases.forEach(([cidr, mask]) => {
      it(`/${cidr} -> ${mask}`, () => {
        expect(cidrToMask(cidr)).toBe(mask);
      });

      it(`${mask} -> /${cidr}`, () => {
        expect(maskToCidr(mask)).toBe(cidr);
      });
    });
  });

  describe('getWildcardMask', () => {
    it('/24 -> 0.0.0.255', () => {
      expect(getWildcardMask(24)).toBe('0.0.0.255');
    });

    it('/32 -> 0.0.0.0', () => {
      expect(getWildcardMask(32)).toBe('0.0.0.0');
    });

    it('/0 -> 255.255.255.255', () => {
      expect(getWildcardMask(0)).toBe('255.255.255.255');
    });

    it('/26 -> 0.0.0.63', () => {
      expect(getWildcardMask(26)).toBe('0.0.0.63');
    });

    it('/20 -> 0.0.15.255', () => {
      expect(getWildcardMask(20)).toBe('0.0.15.255');
    });
  });

  describe('getNetworkAddress', () => {
    it('192.168.1.100/24 -> 192.168.1.0', () => {
      expect(getNetworkAddress('192.168.1.100', 24)).toBe('192.168.1.0');
    });

    it('10.10.10.10/8 -> 10.0.0.0', () => {
      expect(getNetworkAddress('10.10.10.10', 8)).toBe('10.0.0.0');
    });

    it('172.16.45.200/20 -> 172.16.32.0', () => {
      expect(getNetworkAddress('172.16.45.200', 20)).toBe('172.16.32.0');
    });

    it('192.168.10.130/25 -> 192.168.10.128', () => {
      expect(getNetworkAddress('192.168.10.130', 25)).toBe('192.168.10.128');
    });

    it('10.1.1.1/32 -> 10.1.1.1', () => {
      expect(getNetworkAddress('10.1.1.1', 32)).toBe('10.1.1.1');
    });

    it('192.168.1.65/26 -> 192.168.1.64', () => {
      expect(getNetworkAddress('192.168.1.65', 26)).toBe('192.168.1.64');
    });
  });

  describe('getBroadcastAddress', () => {
    it('192.168.1.100/24 -> 192.168.1.255', () => {
      expect(getBroadcastAddress('192.168.1.100', 24)).toBe('192.168.1.255');
    });

    it('10.10.10.10/8 -> 10.255.255.255', () => {
      expect(getBroadcastAddress('10.10.10.10', 8)).toBe('10.255.255.255');
    });

    it('172.16.45.200/20 -> 172.16.47.255', () => {
      expect(getBroadcastAddress('172.16.45.200', 20)).toBe('172.16.47.255');
    });

    it('192.168.10.130/25 -> 192.168.10.255', () => {
      expect(getBroadcastAddress('192.168.10.130', 25)).toBe('192.168.10.255');
    });

    it('10.1.1.1/32 -> 10.1.1.1', () => {
      expect(getBroadcastAddress('10.1.1.1', 32)).toBe('10.1.1.1');
    });
  });

  describe('getFirstHost / getLastHost', () => {
    it('/24 network', () => {
      expect(getFirstHost('192.168.1.0', 24)).toBe('192.168.1.1');
      expect(getLastHost('192.168.1.0', 24)).toBe('192.168.1.254');
    });

    it('/25 network', () => {
      expect(getFirstHost('192.168.10.128', 25)).toBe('192.168.10.129');
      expect(getLastHost('192.168.10.128', 25)).toBe('192.168.10.254');
    });

    it('/30 point-to-point', () => {
      expect(getFirstHost('10.0.0.0', 30)).toBe('10.0.0.1');
      expect(getLastHost('10.0.0.0', 30)).toBe('10.0.0.2');
    });

    it('/31 RFC 3021 - both addresses usable', () => {
      expect(getFirstHost('10.0.0.0', 31)).toBe('10.0.0.0');
      expect(getLastHost('10.0.0.0', 31)).toBe('10.0.0.1');
    });

    it('/32 host route', () => {
      expect(getFirstHost('10.0.0.1', 32)).toBe('10.0.0.1');
      expect(getLastHost('10.0.0.1', 32)).toBe('10.0.0.1');
    });
  });

  describe('getTotalHosts / getUsableHosts', () => {
    it('/24: 256 total, 254 usable', () => {
      expect(getTotalHosts(24)).toBe(256);
      expect(getUsableHosts(24)).toBe(254);
    });

    it('/25: 128 total, 126 usable', () => {
      expect(getTotalHosts(25)).toBe(128);
      expect(getUsableHosts(25)).toBe(126);
    });

    it('/30: 4 total, 2 usable', () => {
      expect(getTotalHosts(30)).toBe(4);
      expect(getUsableHosts(30)).toBe(2);
    });

    it('/31 RFC 3021: 2 total, 2 usable', () => {
      expect(getTotalHosts(31)).toBe(2);
      expect(getUsableHosts(31)).toBe(2);
    });

    it('/32: 1 total, 1 usable', () => {
      expect(getTotalHosts(32)).toBe(1);
      expect(getUsableHosts(32)).toBe(1);
    });

    it('/16: 65536 total, 65534 usable', () => {
      expect(getTotalHosts(16)).toBe(65536);
      expect(getUsableHosts(16)).toBe(65534);
    });

    it('/8: 16777216 total, 16777214 usable', () => {
      expect(getTotalHosts(8)).toBe(16777216);
      expect(getUsableHosts(8)).toBe(16777214);
    });
  });

  describe('isValidIp', () => {
    it('valid IPs', () => {
      expect(isValidIp('192.168.1.1')).toBe(true);
      expect(isValidIp('10.0.0.0')).toBe(true);
      expect(isValidIp('255.255.255.255')).toBe(true);
      expect(isValidIp('0.0.0.0')).toBe(true);
    });

    it('invalid IPs', () => {
      expect(isValidIp('256.1.1.1')).toBe(false);
      expect(isValidIp('1.1.1')).toBe(false);
      expect(isValidIp('1.1.1.1.1')).toBe(false);
      expect(isValidIp('abc.def.ghi.jkl')).toBe(false);
      expect(isValidIp('')).toBe(false);
      expect(isValidIp('192.168.1.-1')).toBe(false);
    });
  });

  describe('isValidCidr', () => {
    it('valid CIDRs (0-32)', () => {
      for (let i = 0; i <= 32; i++) {
        expect(isValidCidr(i)).toBe(true);
      }
    });

    it('invalid CIDRs', () => {
      expect(isValidCidr(-1)).toBe(false);
      expect(isValidCidr(33)).toBe(false);
      expect(isValidCidr(100)).toBe(false);
    });
  });

  describe('getSubnetInfo - comprehensive scenarios', () => {
    it('192.168.1.100/24 - standard Class C', () => {
      const info = getSubnetInfo('192.168.1.100', 24);
      expect(info.networkAddress).toBe('192.168.1.0');
      expect(info.broadcastAddress).toBe('192.168.1.255');
      expect(info.subnetMask).toBe('255.255.255.0');
      expect(info.wildcardMask).toBe('0.0.0.255');
      expect(info.firstHost).toBe('192.168.1.1');
      expect(info.lastHost).toBe('192.168.1.254');
      expect(info.totalHosts).toBe(256);
      expect(info.usableHosts).toBe(254);
      expect(info.cidr).toBe(24);
    });

    it('10.50.168.73/21 - complex subnetting', () => {
      const info = getSubnetInfo('10.50.168.73', 21);
      expect(info.networkAddress).toBe('10.50.168.0');
      expect(info.broadcastAddress).toBe('10.50.175.255');
      expect(info.subnetMask).toBe('255.255.248.0');
      expect(info.wildcardMask).toBe('0.0.7.255');
      expect(info.firstHost).toBe('10.50.168.1');
      expect(info.lastHost).toBe('10.50.175.254');
      expect(info.totalHosts).toBe(2048);
      expect(info.usableHosts).toBe(2046);
    });

    it('172.16.100.50/28 - 16-host subnet', () => {
      const info = getSubnetInfo('172.16.100.50', 28);
      expect(info.networkAddress).toBe('172.16.100.48');
      expect(info.broadcastAddress).toBe('172.16.100.63');
      expect(info.subnetMask).toBe('255.255.255.240');
      expect(info.wildcardMask).toBe('0.0.0.15');
      expect(info.firstHost).toBe('172.16.100.49');
      expect(info.lastHost).toBe('172.16.100.62');
      expect(info.totalHosts).toBe(16);
      expect(info.usableHosts).toBe(14);
    });

    it('192.168.5.200/27 - 32-host subnet', () => {
      const info = getSubnetInfo('192.168.5.200', 27);
      expect(info.networkAddress).toBe('192.168.5.192');
      expect(info.broadcastAddress).toBe('192.168.5.223');
      expect(info.subnetMask).toBe('255.255.255.224');
      expect(info.firstHost).toBe('192.168.5.193');
      expect(info.lastHost).toBe('192.168.5.222');
      expect(info.totalHosts).toBe(32);
      expect(info.usableHosts).toBe(30);
    });

    it('10.0.0.4/30 - point-to-point link', () => {
      const info = getSubnetInfo('10.0.0.4', 30);
      expect(info.networkAddress).toBe('10.0.0.4');
      expect(info.broadcastAddress).toBe('10.0.0.7');
      expect(info.firstHost).toBe('10.0.0.5');
      expect(info.lastHost).toBe('10.0.0.6');
      expect(info.totalHosts).toBe(4);
      expect(info.usableHosts).toBe(2);
    });
  });
});
