// ============================================================
// CCNA Simulator - Shared Types
// Used by both server and client
// ============================================================

// ---- Enums as union types (SQLite compatible) ----

export type Language = 'en' | 'es';

export type ExamMode =
  | 'full_simulation'
  | 'topic_practice'
  | 'custom'
  | 'incorrect_review'
  | 'subnetting_practice'
  | 'command_practice'
  | 'troubleshooting_practice';

export type Difficulty = 'basic' | 'intermediate' | 'advanced' | 'mixed';

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'subnetting'
  | 'ipv4_calculation'
  | 'ipv6_addressing'
  | 'routing_table'
  | 'ios_commands'
  | 'router_config'
  | 'switch_config'
  | 'troubleshooting'
  | 'topology_analysis'
  | 'network_security'
  | 'automation';

export type ValidationStatus = 'draft' | 'pending_review' | 'validated' | 'rejected';

export type ExamStatus = 'configured' | 'in_progress' | 'completed' | 'expired' | 'abandoned';

export type ExamQuestionStatus = 'pending' | 'answered' | 'skipped' | 'timed_out';

export type UserRole = 'user' | 'admin';

export type SourceType = 'official_docs' | 'original' | 'user_import' | 'rfc' | 'textbook';

// ---- CCNA Exam Areas ----

export type ExamArea =
  | 'network_fundamentals'
  | 'network_access'
  | 'ip_connectivity'
  | 'ip_services'
  | 'security_fundamentals'
  | 'automation_programmability';

export const EXAM_AREA_WEIGHTS: Record<ExamArea, number> = {
  network_fundamentals: 20,
  network_access: 20,
  ip_connectivity: 25,
  ip_services: 10,
  security_fundamentals: 15,
  automation_programmability: 10,
};

export const EXAM_AREA_LABELS: Record<ExamArea, { en: string; es: string }> = {
  network_fundamentals: { en: 'Network Fundamentals', es: 'Fundamentos de Redes' },
  network_access: { en: 'Network Access', es: 'Acceso a la Red' },
  ip_connectivity: { en: 'IP Connectivity', es: 'Conectividad IP' },
  ip_services: { en: 'IP Services', es: 'Servicios IP' },
  security_fundamentals: { en: 'Security Fundamentals', es: 'Fundamentos de Seguridad' },
  automation_programmability: { en: 'Automation and Programmability', es: 'Automatización y Programabilidad' },
};

// ---- Exam Configuration ----

export interface ExamConfig {
  questionCount: number;
  durationMinutes: number;
  language: Language;
  mode: ExamMode;
  difficulty: Difficulty;
  topics: string[];
  randomize: boolean;
  strictMode: boolean;
  studyMode: boolean;
  untimed?: boolean;
  showExplanations: boolean;
  soundEnabled: boolean;
  /** Server-created link to the original study attempt; never grants access. */
  practiceSourceExamId?: string;
  perQuestionTimeLimit?: number;
  groupByTopic: boolean;
}

export const QUESTION_COUNT_OPTIONS = [10, 25, 50, 75, 100] as const;
export const DURATION_OPTIONS = [15, 30, 60, 90, 120] as const;

// ---- API Types ----

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ---- Question Types (API responses) ----

export interface QuestionListItem {
  id: string;
  statement: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  topicName: string;
  examArea: ExamArea;
  validationStatus: ValidationStatus;
  optionCount: number;
}

export interface QuestionDetail {
  sourceLicense?: string;
  sourceUrl?: string;
  questionFamilyId?: string;
  id: string;
  statementEn: string;
  statementEs: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  multipleAnswerCount?: number | null;
  estimatedTimeSeconds: number;
  validationStatus: ValidationStatus;
  explanationEn?: string;
  explanationEs?: string;
  correctAnswerExplanationEn?: string;
  correctAnswerExplanationEs?: string;
  primaryTopic: TopicInfo;
  subtopics: string[];
  source?: SourceInfo;
  options: QuestionOptionDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOptionDetail {
  id: string;
  optionLabel: string;
  optionTextEn: string;
  optionTextEs: string;
  isCorrect: boolean;
  explanationEn?: string;
  explanationEs?: string;
  displayOrder: number;
}

/** Question as served during an exam - NO correct answers */
export interface ExamQuestionView {
  id: string;
  examQuestionId: string;
  statement: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  multipleAnswerCount?: number;
  estimatedTimeSeconds: number;
  topicName: string;
  options: ExamOptionView[];
  selectedOptionIds?: string[];
  feedback?: SubmitAnswerResponse;
  questionNumber: number;
  totalQuestions: number;
}

export interface ExamOptionView {
  id: string;
  label: string;
  text: string;
  displayOrder: number;
}

// ---- Topic Types ----

export interface TopicInfo {
  id: string;
  nameEn: string;
  nameEs: string;
  examArea: ExamArea;
  examAreaNumber: string;
  weightPercentage: number;
}

export interface TopicWithCount extends TopicInfo {
  questionCount: number;
  validatedCount: number;
}

// ---- Source Types ----

export interface SourceInfo {
  id: string;
  name: string;
  url?: string;
  sourceType: SourceType;
  license?: string;
}

// ---- Exam State Types ----

export interface ExamStateResponse {
  questionExpiresAt?: string | null;
  examId: string;
  config: ExamConfig;
  currentQuestionIndex: number;
  totalQuestions: number;
  startedAt: string;
  expiresAt: string | null;
  timeRemainingSeconds: number;
  answeredCount: number;
  status: ExamStatus;
}

export interface SubmitAnswerRequest {
  examQuestionId: string;
  selectedOptionIds: string[];
}

export interface SubmitAnswerResponse {
  questionExpiresAt?: string | null;
  confirmed: boolean;
  nextQuestionIndex: number;
  /** Only in study mode */
  isCorrect?: boolean;
  /** Only in study mode */
  explanation?: string;
  /** Only in study mode */
  correctOptionIds?: string[];
}

// ---- Results Types ----

export interface ExamResultResponse {
  examId: string;
  score: number;
  percentage: number;
  passed: boolean;
  passingPercentage: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  totalTimeSeconds: number;
  averageTimePerQuestion: number;
  startedAt: string;
  completedAt: string;
  language: Language;
  mode: ExamMode;
  difficulty: Difficulty;
  topicBreakdown: TopicResultItem[];
  difficultyBreakdown: DifficultyResultItem[];
  recommendations: RecommendationItem[];
}

export interface TopicResultItem {
  topicId: string;
  topicName: string;
  examArea: ExamArea;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
}

export interface DifficultyResultItem {
  difficulty: Difficulty;
  total: number;
  correct: number;
  percentage: number;
}

export interface RecommendationItem {
  area: ExamArea;
  areaName: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  messageEs: string;
  suggestedTopics: string[];
}

// ---- Review Types ----

export interface ReviewQuestionItem {
  historicalContentPreserved?: boolean;
  questionNumber: number;
  examQuestionId: string;
  questionId: string;
  statement: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  topicName: string;
  selectedOptionIds: string[];
  selectedOptionLabels: string[];
  correctOptionIds: string[];
  correctOptionLabels: string[];
  isCorrect: boolean;
  timeSpentSeconds: number;
  options: ReviewOptionItem[];
  explanation: string;
  correctAnswerExplanation: string;
}

export interface ReviewOptionItem {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
  explanation?: string;
}

// ---- History Types ----

export interface ExamHistoryItem {
  examVersion: string;
  examId: string;
  date: string;
  language: Language;
  mode: ExamMode;
  difficulty: Difficulty;
  questionCount: number;
  durationMinutes: number;
  totalTimeSeconds: number;
  score: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  topicBreakdown: TopicResultItem[];
}

// ---- Import/Export Types ----

export interface QuestionImportItem {
  questionFamilyId?: string;
  statementEn: string;
  statementEs: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  primaryTopicExamArea: ExamArea;
  multipleAnswerCount?: number | null;
  estimatedTimeSeconds?: number;
  explanationEn?: string;
  explanationEs?: string;
  correctAnswerExplanationEn?: string;
  correctAnswerExplanationEs?: string;
  options: {
    optionLabel: string;
    optionTextEn: string;
    optionTextEs: string;
    isCorrect: boolean;
    explanationEn?: string;
    explanationEs?: string;
  }[];
  sourceName?: string;
  sourceUrl?: string;
  sourceLicense?: string;
}

export interface ImportResult {
  totalReceived: number;
  imported: number;
  rejected: number;
  duplicates: number;
  errors: ImportError[];
}

export interface ImportError {
  index: number;
  statement: string;
  reason: string;
}

// ---- Batch Report Types ----

export interface BatchReport {
  batchNumber: number;
  createdAt: string;
  questionsCreated: number;
  questionsApproved: number;
  questionsRejected: number;
  questionsPendingReview: number;
  duplicatesDetected: number;
  errorsFound: number;
  coverageByArea: Record<ExamArea, number>;
  totalValidatedInBank: number;
}

// ---- Adaptive Learning Types ----

export interface LearningProfile {
  userId: string;
  weakAreas: WeakAreaItem[];
  repeatedErrors: RepeatedErrorItem[];
  slowTopics: string[];
  overallProgress: ProgressMetrics;
  studyPlan: StudyPlanItem[];
}

export interface WeakAreaItem {
  area: ExamArea;
  areaName: string;
  accuracy: number;
  totalAttempted: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface RepeatedErrorItem {
  topicId: string;
  topicName: string;
  errorCount: number;
  lastSeen: string;
}

export interface ProgressMetrics {
  totalExams: number;
  totalQuestions: number;
  overallAccuracy: number;
  averageScore: number;
  bestScore: number;
  examsTaken7Days: number;
  accuracyTrend: number[];
}

export interface StudyPlanItem {
  area: ExamArea;
  areaName: string;
  priority: number;
  suggestedQuestionCount: number;
  suggestedDifficulty: Difficulty;
  focusTopics: string[];
  message: string;
}
