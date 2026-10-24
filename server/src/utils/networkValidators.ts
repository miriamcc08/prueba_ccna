import {
  isValidIp,
  isValidCidr,
  maskToCidr,
  getSubnetInfo,
  SubnetInfo,
} from './subnetting';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface QuestionValidationInput {
  questionType: string;
  multipleAnswerCount?: number | null;
  statementEn: string;
  statementEs: string;
}

export interface OptionValidationInput {
  id?: string;
  optionLabel: string;
  optionTextEn: string;
  optionTextEs: string;
  isCorrect: boolean;
}

/**
 * Validates question options and answers logic according to CCNA exam rules.
 */
export function validateQuestionAnswers(
  question: QuestionValidationInput,
  options: OptionValidationInput[]
): ValidationResult {
  const errors: string[] = [];

  if (!options || options.length < 2) {
    errors.push('A question must have at least 2 options.');
    return { valid: false, errors };
  }

  // Check unique option labels
  const seenLabels = new Set<string>();
  for (const opt of options) {
    const label = opt.optionLabel.trim().toUpperCase();
    if (!label) {
      errors.push('Option label cannot be empty.');
    } else if (seenLabels.has(label)) {
      errors.push(`Duplicate option label found: "${label}".`);
    } else {
      seenLabels.add(label);
    }

    if (!opt.optionTextEn?.trim()) {
      errors.push(`Option ${label || '?'} is missing English text.`);
    }
    if (!opt.optionTextEs?.trim()) {
      errors.push(`Option ${label || '?'} is missing Spanish text.`);
    }
  }

  const correctOptions = options.filter((o) => o.isCorrect);

  if (correctOptions.length === 0) {
    errors.push('At least one option must be marked as correct.');
  }

  const qType = question.questionType;

  if (qType === 'single_choice' || qType === 'true_false') {
    if (correctOptions.length !== 1) {
      errors.push(
        `${qType} questions must have exactly 1 correct option. Found ${correctOptions.length}.`
      );
    }
    if (qType === 'true_false' && options.length !== 2) {
      errors.push(`true_false questions must have exactly 2 options. Found ${options.length}.`);
    }
  } else if (qType === 'multiple_choice') {
    if (correctOptions.length < 2) {
      errors.push(
        `multiple_choice questions must have at least 2 correct options. Found ${correctOptions.length}.`
      );
    }
    if (
      question.multipleAnswerCount != null &&
      question.multipleAnswerCount > 0 &&
      correctOptions.length !== question.multipleAnswerCount
    ) {
      errors.push(
        `Declared multipleAnswerCount (${question.multipleAnswerCount}) does not match the number of correct options (${correctOptions.length}).`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export interface SubnetQuestionValidationResult extends ValidationResult {
  calculatedSubnet?: SubnetInfo;
}

/**
 * Validates mathematical and addressing correctness of subnetting questions.
 */
export function validateSubnettingQuestion(
  question: { statementEn: string },
  options?: OptionValidationInput[]
): SubnetQuestionValidationResult {
  const errors: string[] = [];
  const text = question.statementEn;

  // Regex to extract IP and CIDR e.g. 192.168.1.50/26 or 10.0.0.0/8
  const cidrRegex = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})\b/;
  // Regex to extract IP with subnet mask e.g. 192.168.1.0 (mask 255.255.255.0) or netmask 255.255.255.0
  const maskRegex = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+(?:with\s+)?(?:subnet\s+mask|netmask|mask)\s+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/i;

  let ip: string | null = null;
  let cidr: number | null = null;

  const cidrMatch = text.match(cidrRegex);
  if (cidrMatch) {
    if (isValidIp(cidrMatch[1]) && isValidCidr(Number(cidrMatch[2]))) {
      ip = cidrMatch[1];
      cidr = Number(cidrMatch[2]);
    }
  } else {
    const maskMatch = text.match(maskRegex);
    if (maskMatch && isValidIp(maskMatch[1]) && isValidIp(maskMatch[2])) {
      try {
        ip = maskMatch[1];
        cidr = maskToCidr(maskMatch[2]);
      } catch (e: unknown) {
        errors.push((e as Error).message);
      }
    }
  }

  let calculatedSubnet: SubnetInfo | undefined;

  if (ip && cidr !== null) {
    try {
      calculatedSubnet = getSubnetInfo(ip, cidr);

      // If options are provided, check if the correct answer contains legitimate subnet info
      if (options && options.length > 0) {
        const correctOptions = options.filter((o) => o.isCorrect);
        const lowerText = text.toLowerCase();

        // Check if question asks for network address
        if (lowerText.includes('network address') || lowerText.includes('network id') || lowerText.includes('subnet address')) {
          const hasExpectedAnswer = correctOptions.some(
            (o) => o.optionTextEn.includes(calculatedSubnet!.networkAddress)
          );
          if (!hasExpectedAnswer && correctOptions.length > 0) {
            errors.push(
              `Expected network address "${calculatedSubnet.networkAddress}" not found in correct option(s).`
            );
          }
        }

        // Check if question asks for broadcast address
        if (lowerText.includes('broadcast address')) {
          const hasExpectedAnswer = correctOptions.some(
            (o) => o.optionTextEn.includes(calculatedSubnet!.broadcastAddress)
          );
          if (!hasExpectedAnswer && correctOptions.length > 0) {
            errors.push(
              `Expected broadcast address "${calculatedSubnet.broadcastAddress}" not found in correct option(s).`
            );
          }
        }

        // Check if question asks for usable hosts count
        if (lowerText.includes('usable host') || lowerText.includes('valid host')) {
          const hasExpectedCount = correctOptions.some((o) =>
            o.optionTextEn.includes(String(calculatedSubnet!.usableHosts))
          );
          if (!hasExpectedCount && !lowerText.includes('range') && correctOptions.length > 0) {
            // Note: could be a range or a number
          }
        }
      }
    } catch (e: unknown) {
      errors.push(`Subnet calculation error: ${(e as Error).message}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    calculatedSubnet,
  };
}

/**
 * Validates Cisco IOS ACL command syntax.
 * Supports standard and extended numbered ACLs as well as named ACL rule lines.
 */
export function validateACLRule(rule: string): ValidationResult & { aclType?: string } {
  const errors: string[] = [];
  const trimmed = rule.trim().replace(/\s+/g, ' ');

  if (!trimmed) {
    return { valid: false, errors: ['ACL rule cannot be empty.'] };
  }

  // Common tokens
  const actionRegex = /^(permit|deny|remark)\b/i;

  // Numbered standard ACL: access-list <1-99|1300-1999> <permit|deny|remark> ...
  const numberedAclRegex = /^access-list\s+(\d+)\s+(permit|deny|remark)\s+(.*)$/i;
  const numberedMatch = trimmed.match(numberedAclRegex);

  if (numberedMatch) {
    const aclNum = Number(numberedMatch[1]);
    const action = numberedMatch[2].toLowerCase();
    const rest = numberedMatch[3].trim();

    if (action === 'remark') {
      return { valid: true, errors: [], aclType: 'remark' };
    }

    // Standard ACL: 1-99 or 1300-1999
    const isStandard = (aclNum >= 1 && aclNum <= 99) || (aclNum >= 1300 && aclNum <= 1999);
    // Extended ACL: 100-199 or 2000-2699
    const isExtended = (aclNum >= 100 && aclNum <= 199) || (aclNum >= 2000 && aclNum <= 2699);

    if (!isStandard && !isExtended) {
      errors.push(`ACL number ${aclNum} is not a valid standard (1-99, 1300-1999) or extended (100-199, 2000-2699) ACL number.`);
      return { valid: false, errors };
    }

    if (isStandard) {
      // Standard ACL source: any | host <ip> | <ip> <wildcard> | <ip>
      const stdSourceRegex = /^(any|host\s+\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\s+\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})?)$/i;
      if (!stdSourceRegex.test(rest)) {
        errors.push(`Invalid standard ACL source specification: "${rest}". Expected "any", "host <ip>", or "<ip> <wildcard>".`);
      }
      return { valid: errors.length === 0, errors, aclType: 'standard_numbered' };
    }

    if (isExtended) {
      // Extended ACL: <protocol> <source> <destination> [options]
      const extProtocols = /^(ip|tcp|udp|icmp|gre|ospf|eigrp|igmp)\s+/i;
      if (!extProtocols.test(rest)) {
        errors.push(`Invalid or unsupported extended ACL protocol in: "${rest}". Expected ip, tcp, udp, icmp, etc.`);
      }
      return { valid: errors.length === 0, errors, aclType: 'extended_numbered' };
    }
  }

  // Standalone rule inside named ACL (e.g. "permit tcp 192.168.1.0 0.0.0.255 any eq 80")
  if (actionRegex.test(trimmed)) {
    const parts = trimmed.split(' ');
    const action = parts[0].toLowerCase();
    if (action === 'remark') {
      return { valid: true, errors: [], aclType: 'remark' };
    }

    // Extended rule with protocol
    const protocols = ['ip', 'tcp', 'udp', 'icmp', 'ospf', 'eigrp'];
    if (protocols.includes(parts[1]?.toLowerCase())) {
      return { valid: true, errors: [], aclType: 'extended_rule' };
    }

    // Standard rule without protocol
    return { valid: true, errors: [], aclType: 'standard_rule' };
  }

  // Named ACL definition line: ip access-list standard|extended <name>
  const namedDefRegex = /^ip\s+access-list\s+(standard|extended)\s+([a-zA-Z0-9_-]+)$/i;
  const namedMatch = trimmed.match(namedDefRegex);
  if (namedMatch) {
    return { valid: true, errors: [], aclType: `named_${namedMatch[1].toLowerCase()}_definition` };
  }

  errors.push(`Unrecognized Cisco IOS ACL syntax: "${rule}".`);
  return { valid: false, errors };
}

/**
 * Normalizes text for similarity comparison (lowercasing, removing non-alphanumeric, collapsing spaces).
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates Jaccard token similarity between two text strings.
 */
function jaccardSimilarity(text1: string, text2: string): number {
  const words1 = new Set(normalizeText(text1).split(' ').filter((w) => w.length > 2));
  const words2 = new Set(normalizeText(text2).split(' ').filter((w) => w.length > 2));

  if (words1.size === 0 && words2.size === 0) return 1;
  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  for (const word of words1) {
    if (words2.has(word)) {
      intersection++;
    }
  }

  const union = new Set([...words1, ...words2]).size;
  return union === 0 ? 0 : intersection / union;
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  similarity: number;
  matchingQuestionId?: string;
  matchingStatement?: string;
}

/**
 * Detects whether a new question is a duplicate of any existing questions in the question bank.
 * Uses normalized token Jaccard similarity with a threshold of 0.85 (85%).
 */
export function detectDuplicate(
  newQuestion: { statementEn: string; statementEs?: string },
  existingQuestions: Array<{ id: string; statementEn: string; statementEs?: string }>,
  threshold = 0.85
): DuplicateDetectionResult {
  let highestSimilarity = 0;
  let matchingQuestion: { id: string; statementEn: string } | undefined;

  for (const existing of existingQuestions) {
    // Check English statements
    const simEn = jaccardSimilarity(newQuestion.statementEn, existing.statementEn);
    let sim = simEn;

    // Check Spanish statements if present
    if (newQuestion.statementEs && existing.statementEs) {
      const simEs = jaccardSimilarity(newQuestion.statementEs, existing.statementEs);
      sim = Math.max(simEn, simEs);
    }

    if (sim > highestSimilarity) {
      highestSimilarity = sim;
      matchingQuestion = existing;
    }

    if (highestSimilarity >= threshold) {
      break;
    }
  }

  return {
    isDuplicate: highestSimilarity >= threshold,
    similarity: Math.round(highestSimilarity * 100) / 100,
    matchingQuestionId: highestSimilarity >= threshold ? matchingQuestion?.id : undefined,
    matchingStatement: highestSimilarity >= threshold ? matchingQuestion?.statementEn : undefined,
  };
}
