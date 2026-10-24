/**
 * IPv4 Subnetting Calculator Utility
 * Deterministic, precise, and compliant with CCNA 200-301 standards.
 */

export interface SubnetInfo {
  ipAddress: string;
  cidr: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  isPrivate: boolean;
  ipClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'Unknown';
}

/**
 * Validates whether a string is a valid IPv4 address in dotted-decimal format.
 */
export function isValidIp(ip: string): boolean {
  if (typeof ip !== 'string') return false;
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return false;

  for (const part of parts) {
    if (!/^\d+$/.test(part)) return false;
    // Check for leading zeros (e.g. "01" is invalid, but "0" is valid)
    if (part.length > 1 && part.startsWith('0')) return false;
    const num = Number(part);
    if (isNaN(num) || num < 0 || num > 255) return false;
  }
  return true;
}

/**
 * Validates whether a CIDR prefix length is valid (0 - 32).
 */
export function isValidCidr(cidr: number): boolean {
  return Number.isInteger(cidr) && cidr >= 0 && cidr <= 32;
}

/**
 * Converts a dotted-decimal IPv4 address to an unsigned 32-bit integer.
 */
export function ipToNumber(ip: string): number {
  if (!isValidIp(ip)) {
    throw new Error(`Invalid IPv4 address: "${ip}"`);
  }
  const octets = ip.trim().split('.').map(Number);
  return (((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0);
}

/**
 * Converts an unsigned 32-bit integer to a dotted-decimal IPv4 address.
 */
export function numberToIp(num: number): string {
  const n = num >>> 0;
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join('.');
}

/**
 * Converts a CIDR prefix length (0-32) to dotted-decimal subnet mask.
 */
export function cidrToMask(cidr: number): string {
  if (!isValidCidr(cidr)) {
    throw new Error(`Invalid CIDR prefix length: ${cidr}. Must be between 0 and 32.`);
  }
  if (cidr === 0) return '0.0.0.0';
  const maskNum = ((0xFFFFFFFF << (32 - cidr)) >>> 0);
  return numberToIp(maskNum);
}

/**
 * Converts a dotted-decimal subnet mask to CIDR prefix length (0-32).
 */
export function maskToCidr(mask: string): number {
  if (!isValidIp(mask)) {
    throw new Error(`Invalid subnet mask format: "${mask}"`);
  }
  const maskNum = ipToNumber(mask);
  // Check that mask consists of contiguous 1s followed by contiguous 0s
  const inverted = (~maskNum) >>> 0;
  // If inverted + 1 is a power of 2, it is a valid netmask
  if ((inverted & (inverted + 1)) !== 0) {
    throw new Error(`Invalid subnet mask (non-contiguous bits): "${mask}"`);
  }

  // Count leading 1s
  let count = 0;
  for (let i = 31; i >= 0; i--) {
    if ((maskNum & (1 << i)) !== 0) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

/**
 * Calculates the wildcard mask for a given CIDR prefix length.
 */
export function getWildcardMask(cidr: number): string {
  if (!isValidCidr(cidr)) {
    throw new Error(`Invalid CIDR prefix length: ${cidr}`);
  }
  if (cidr === 0) return '255.255.255.255';
  if (cidr === 32) return '0.0.0.0';
  const wildcardNum = (0xFFFFFFFF >>> cidr) >>> 0;
  return numberToIp(wildcardNum);
}

/**
 * Calculates the network address for an IP address and CIDR prefix length.
 */
export function getNetworkAddress(ip: string, cidr: number): string {
  if (!isValidCidr(cidr)) {
    throw new Error(`Invalid CIDR: ${cidr}`);
  }
  if (cidr === 0) return '0.0.0.0';
  const ipNum = ipToNumber(ip);
  const maskNum = ((0xFFFFFFFF << (32 - cidr)) >>> 0);
  const networkNum = (ipNum & maskNum) >>> 0;
  return numberToIp(networkNum);
}

/**
 * Calculates the broadcast address for an IP address and CIDR prefix length.
 */
export function getBroadcastAddress(ip: string, cidr: number): string {
  if (!isValidCidr(cidr)) {
    throw new Error(`Invalid CIDR: ${cidr}`);
  }
  if (cidr === 0) return '255.255.255.255';
  if (cidr === 32) return getNetworkAddress(ip, cidr);
  const netNum = ipToNumber(getNetworkAddress(ip, cidr));
  const wildcardNum = (0xFFFFFFFF >>> cidr) >>> 0;
  const bcastNum = (netNum | wildcardNum) >>> 0;
  return numberToIp(bcastNum);
}

/**
 * Calculates the total number of IP addresses in the subnet.
 */
export function getTotalHosts(cidr: number): number {
  if (!isValidCidr(cidr)) {
    throw new Error(`Invalid CIDR: ${cidr}`);
  }
  return Math.pow(2, 32 - cidr);
}

/**
 * Calculates usable host addresses in the subnet.
 * Handles edge cases:
 * - /32: 1 host (single host route)
 * - /31: 2 usable hosts (RFC 3021 point-to-point links)
 * - /0: 2^32 - 2 hosts
 * - Others: 2^(32-cidr) - 2 hosts
 */
export function getUsableHosts(cidr: number): number {
  if (!isValidCidr(cidr)) {
    throw new Error(`Invalid CIDR: ${cidr}`);
  }
  if (cidr === 32) return 1;
  if (cidr === 31) return 2;
  if (cidr === 0) return Math.pow(2, 32) - 2;
  return Math.max(0, Math.pow(2, 32 - cidr) - 2);
}

/**
 * Calculates the first usable host IP address.
 */
export function getFirstHost(ip: string, cidr: number): string {
  if (!isValidCidr(cidr)) {
    throw new Error(`Invalid CIDR: ${cidr}`);
  }
  if (cidr === 32) return ip;
  const netNum = ipToNumber(getNetworkAddress(ip, cidr));
  if (cidr === 31) {
    // RFC 3021 allows network address as first host on point-to-point
    return numberToIp(netNum);
  }
  if (cidr === 0) return '0.0.0.1';
  return numberToIp((netNum + 1) >>> 0);
}

/**
 * Calculates the last usable host IP address.
 */
export function getLastHost(ip: string, cidr: number): string {
  if (!isValidCidr(cidr)) {
    throw new Error(`Invalid CIDR: ${cidr}`);
  }
  if (cidr === 32) return ip;
  const bcastNum = ipToNumber(getBroadcastAddress(ip, cidr));
  if (cidr === 31) {
    // RFC 3021 allows broadcast address as second host on point-to-point
    return numberToIp(bcastNum);
  }
  if (cidr === 0) return '255.255.255.254';
  return numberToIp((bcastNum - 1) >>> 0);
}

/**
 * Determines whether an IP is in RFC 1918 private address ranges:
 * - 10.0.0.0/8
 * - 172.16.0.0/12
 * - 192.168.0.0/16
 */
export function isPrivateIp(ip: string): boolean {
  const num = ipToNumber(ip);
  const net10 = (ipToNumber('10.0.0.0') & (0xFF000000 >>> 0)) >>> 0;
  if (((num & 0xFF000000) >>> 0) === net10) return true;

  const net172 = (ipToNumber('172.16.0.0') & (0xFFF00000 >>> 0)) >>> 0;
  if (((num & 0xFFF00000) >>> 0) === net172) return true;

  const net192 = (ipToNumber('192.168.0.0') & (0xFFFF0000 >>> 0)) >>> 0;
  if (((num & 0xFFFF0000) >>> 0) === net192) return true;

  return false;
}

/**
 * Identifies the IPv4 class (A, B, C, D, E).
 */
export function getIpClass(ip: string): 'A' | 'B' | 'C' | 'D' | 'E' | 'Unknown' {
  if (!isValidIp(ip)) return 'Unknown';
  const firstOctet = Number(ip.split('.')[0]);
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D';
  if (firstOctet >= 240 && firstOctet <= 255) return 'E';
  return 'Unknown';
}

/**
 * Returns comprehensive subnet calculation data for an IP and CIDR.
 */
export function getSubnetInfo(ip: string, cidr: number): SubnetInfo {
  if (!isValidIp(ip)) {
    throw new Error(`Invalid IP address: "${ip}"`);
  }
  if (!isValidCidr(cidr)) {
    throw new Error(`Invalid CIDR prefix length: ${cidr}`);
  }

  return {
    ipAddress: ip,
    cidr,
    subnetMask: cidrToMask(cidr),
    wildcardMask: getWildcardMask(cidr),
    networkAddress: getNetworkAddress(ip, cidr),
    broadcastAddress: getBroadcastAddress(ip, cidr),
    firstHost: getFirstHost(ip, cidr),
    lastHost: getLastHost(ip, cidr),
    totalHosts: getTotalHosts(cidr),
    usableHosts: getUsableHosts(cidr),
    isPrivate: isPrivateIp(ip),
    ipClass: getIpClass(ip),
  };
}
