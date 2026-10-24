-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "language" TEXT NOT NULL DEFAULT 'en',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionEs" TEXT,
    "examArea" TEXT NOT NULL,
    "examAreaNumber" TEXT NOT NULL,
    "weightPercentage" INTEGER NOT NULL,
    "examVersion" TEXT NOT NULL DEFAULT '200-301-v1.1',
    "learningObjectives" TEXT,
    "parentTopicId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Topic_parentTopicId_fkey" FOREIGN KEY ("parentTopicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "sourceType" TEXT NOT NULL,
    "consultedAt" DATETIME,
    "reuseConditions" TEXT,
    "license" TEXT,
    "validationNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionFamilyId" TEXT,
    "statementEn" TEXT NOT NULL,
    "statementEs" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "multipleAnswerCount" INTEGER,
    "estimatedTimeSeconds" INTEGER NOT NULL DEFAULT 90,
    "validationStatus" TEXT NOT NULL DEFAULT 'draft',
    "lastVerifiedAt" DATETIME,
    "examVersion" TEXT NOT NULL DEFAULT '200-301-v1.1',
    "explanationEn" TEXT,
    "explanationEs" TEXT,
    "correctAnswerExplanationEn" TEXT,
    "correctAnswerExplanationEs" TEXT,
    "primaryTopicId" TEXT NOT NULL,
    "subtopics" TEXT,
    "sourceId" TEXT,
    "sourceUrl" TEXT,
    "sourceLicense" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_primaryTopicId_fkey" FOREIGN KEY ("primaryTopicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Question_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "optionLabel" TEXT NOT NULL,
    "optionTextEn" TEXT NOT NULL,
    "optionTextEs" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "explanationEn" TEXT,
    "explanationEs" TEXT,
    "displayOrder" INTEGER NOT NULL,
    CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalQuestionId" TEXT NOT NULL,
    "variantQuestionId" TEXT NOT NULL,
    "modifiedParameters" TEXT,
    "validationStatus" TEXT NOT NULL DEFAULT 'draft',
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestionVariant_originalQuestionId_fkey" FOREIGN KEY ("originalQuestionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuestionVariant_variantQuestionId_fkey" FOREIGN KEY ("variantQuestionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "questionCount" INTEGER NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "strictMode" BOOLEAN NOT NULL DEFAULT true,
    "studyMode" BOOLEAN NOT NULL DEFAULT false,
    "selectedTopics" TEXT,
    "examVersion" TEXT NOT NULL DEFAULT '200-301-v1.1',
    "status" TEXT NOT NULL DEFAULT 'configured',
    "currentQuestionIdx" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME,
    "expiresAt" DATETIME,
    "completedAt" DATETIME,
    "score" REAL,
    "percentage" REAL,
    "correctCount" INTEGER,
    "incorrectCount" INTEGER,
    "unansweredCount" INTEGER,
    "totalTimeSeconds" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Exam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExamQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "examId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "answeredAt" DATETIME,
    "timeSpentSeconds" INTEGER,
    CONSTRAINT "ExamQuestion_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExamResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "examQuestionId" TEXT NOT NULL,
    "selectedOptionId" TEXT NOT NULL,
    "isCorrect" BOOLEAN,
    "confirmedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExamResponse_examQuestionId_fkey" FOREIGN KEY ("examQuestionId") REFERENCES "ExamQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamResponse_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "QuestionOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionFavorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestionFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuestionFavorite_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_code_key" ON "Topic"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ExamQuestion_examId_questionOrder_key" ON "ExamQuestion"("examId", "questionOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResponse_examQuestionId_selectedOptionId_key" ON "ExamResponse"("examQuestionId", "selectedOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionFavorite_userId_questionId_key" ON "QuestionFavorite"("userId", "questionId");
