import { z } from 'zod';

// ---- Enum Values ----
export const LANGUAGES = ['en', 'es'] as const;

export const EXAM_MODES = [
  'full_simulation',
  'topic_practice',
  'custom',
  'incorrect_review',
  'subnetting_practice',
  'command_practice',
  'troubleshooting_practice',
] as const;

export const DIFFICULTIES = ['basic', 'intermediate', 'advanced', 'mixed'] as const;

export const QUESTION_TYPES = [
  'single_choice',
  'multiple_choice',
  'true_false',
  'subnetting',
  'ipv4_calculation',
  'ipv6_addressing',
  'routing_table',
  'ios_commands',
  'router_config',
  'switch_config',
  'troubleshooting',
  'topology_analysis',
  'network_security',
  'automation',
] as const;

export const VALIDATION_STATUSES = ['draft', 'pending_review', 'validated', 'rejected'] as const;

export const EXAM_AREAS = [
  'network_fundamentals',
  'network_access',
  'ip_connectivity',
  'ip_services',
  'security_fundamentals',
  'automation_programmability',
] as const;

export const SOURCE_TYPES = [
  'official_docs',
  'original',
  'user_import',
  'rfc',
  'textbook',
] as const;

// ---- 1. Exam Configuration Schema ----
export const createExamSchema = z.object({
  questionCount: z.number().int().min(1).max(200).default(50),
  durationMinutes: z.number().int().min(1).max(300).default(90),
  language: z.enum(LANGUAGES).default('en'),
  mode: z.enum(EXAM_MODES).default('full_simulation'),
  difficulty: z.enum(DIFFICULTIES).default('mixed'),
  topics: z.array(z.string()).default([]),
  randomize: z.boolean().default(true),
  strictMode: z.boolean().default(true),
  studyMode: z.boolean().default(false),
  showExplanations: z.boolean().default(false),
  soundEnabled: z.boolean().default(true),
  perQuestionTimeLimit: z.number().int().min(10).max(600).optional(),
  groupByTopic: z.boolean().default(false),
});

export type CreateExamInput = z.infer<typeof createExamSchema>;

// ---- 2. Submit Answer Schema ----
export const submitAnswerSchema = z.object({
  examQuestionId: z.string().min(1, 'examQuestionId is required'),
  selectedOptionIds: z.array(z.string()),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;

// ---- 3. Register User Schema ----
export const registerUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  language: z.enum(LANGUAGES).default('en'),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

// ---- 4. Login User Schema ----
export const loginUserSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

// ---- 5. Option Schema for Questions ----
export const questionOptionSchema = z.object({
  optionLabel: z.string().min(1).max(5),
  optionTextEn: z.string().min(1, 'English option text is required'),
  optionTextEs: z.string().min(1, 'Spanish option text is required'),
  isCorrect: z.boolean().default(false),
  explanationEn: z.string().optional(),
  explanationEs: z.string().optional(),
  displayOrder: z.number().int().min(0).default(0),
});

// ---- 6. Create Question Schema ----
export const createQuestionSchema = z.object({
  statementEn: z.string().min(5, 'English statement must be at least 5 characters'),
  statementEs: z.string().min(5, 'Spanish statement must be at least 5 characters'),
  questionType: z.enum(QUESTION_TYPES),
  difficulty: z.enum(DIFFICULTIES),
  primaryTopicId: z.string().min(1, 'Primary topic ID is required'),
  subtopics: z.array(z.string()).optional().default([]),
  multipleAnswerCount: z.number().int().min(1).optional().nullable(),
  estimatedTimeSeconds: z.number().int().min(10).max(600).default(90),
  validationStatus: z.enum(VALIDATION_STATUSES).default('draft'),
  explanationEn: z.string().optional(),
  explanationEs: z.string().optional(),
  correctAnswerExplanationEn: z.string().optional(),
  correctAnswerExplanationEs: z.string().optional(),
  sourceId: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  sourceLicense: z.string().optional(),
  options: z.array(questionOptionSchema).min(2, 'At least 2 options are required'),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

// ---- 7. Update Question Schema ----
export const updateQuestionSchema = createQuestionSchema.partial();
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

// ---- 8. Import Question Item Schema ----
export const questionImportItemSchema = z.object({
  statementEn: z.string().min(5),
  statementEs: z.string().min(5),
  questionType: z.enum(QUESTION_TYPES),
  difficulty: z.enum(DIFFICULTIES),
  primaryTopicExamArea: z.enum(EXAM_AREAS),
  multipleAnswerCount: z.number().int().min(1).optional().nullable(),
  estimatedTimeSeconds: z.number().int().min(10).max(600).optional(),
  explanationEn: z.string().optional(),
  explanationEs: z.string().optional(),
  correctAnswerExplanationEn: z.string().optional(),
  correctAnswerExplanationEs: z.string().optional(),
  options: z.array(questionOptionSchema).min(2),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sourceLicense: z.string().optional(),
});

export const importQuestionsSchema = z.object({
  questions: z.array(questionImportItemSchema).min(1, 'At least one question is required for import'),
});

export type ImportQuestionsInput = z.infer<typeof importQuestionsSchema>;

// ---- 9. Question Filter Query Schema ----
export const questionFilterSchema = z.object({
  topic: z.string().optional(),
  examArea: z.enum(EXAM_AREAS).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  questionType: z.enum(QUESTION_TYPES).optional(),
  validationStatus: z.enum(VALIDATION_STATUSES).optional(),
  search: z.string().optional(),
  language: z.enum(LANGUAGES).default('en'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type QuestionFilterInput = z.infer<typeof questionFilterSchema>;
