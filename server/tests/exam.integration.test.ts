import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import type { Server } from 'node:http';
let prisma: typeof import('../src/lib/prisma').prisma;
let engine: typeof import('../src/services/examEngine');
let calculateResults: typeof import('../src/services/scoringEngine').calculateResults;
let getExamReview: typeof import('../src/services/scoringEngine').getExamReview;
import { createExamSchema } from '../src/validators/schemas';
import { generateToken } from '../src/middleware/auth';

const directory = mkdtempSync(join(tmpdir(), 'ccna-integration-'));
let server: Server;
let base: string;
let question: any;
let other: any;
let multi: any;
const config = (overrides = {}) => createExamSchema.parse({ questionCount: 1, mode: 'custom', randomize: false, ...overrides });
async function attempt(overrides = {}) {
  const exam = await engine.createExam(config(overrides));
  await engine.startExam(exam.examId);
  return { id: exam.examId, question: await engine.getCurrentQuestion(exam.examId) };
}
async function request(path: string, method = 'GET', body?: object, token?: string) {
  const response = await fetch(base + path, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, body: await response.json() as any };
}

beforeAll(async () => {
  const db = join(directory, 'test.db');
  writeFileSync(db, '');
  process.env.DATABASE_URL = `file:${db}`;
  execFileSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy'], { env: process.env, stdio: 'pipe' });
  ({ prisma } = await import('../src/lib/prisma'));
  engine = await import('../src/services/examEngine');
  ({ calculateResults, getExamReview } = await import('../src/services/scoringEngine'));
  const { default: app } = await import('../src/index');
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address() as { port: number };
  base = `http://127.0.0.1:${address.port}/api`;
}, 30000);

beforeEach(async () => {
  await prisma.questionReview.deleteMany();
  await prisma.questionFavorite.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.question.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.user.deleteMany();
  const topic = await prisma.topic.create({ data: { code: '1.0', nameEn: 'Networks', nameEs: 'Redes', examArea: 'network_fundamentals', examAreaNumber: '1.0', weightPercentage: 20 } });
  async function make(id: string, status = 'validated', multiple = false) {
    return prisma.question.create({ data: {
      id, statementEn: `Test ${id}`, statementEs: `Prueba ${id}`, questionType: multiple ? 'multiple_choice' : 'single_choice',
      difficulty: 'basic', validationStatus: status, primaryTopicId: topic.id, multipleAnswerCount: multiple ? 2 : null,
      explanationEn: 'Technical explanation', explanationEs: 'Explicación técnica',
      options: { create: ['A', 'B', 'C'].map((label, i) => ({ optionLabel: label, optionTextEn: label, optionTextEs: label, isCorrect: multiple ? i < 2 : i === 0, displayOrder: i })) },
    }, include: { options: true } });
  }
  question = await make('a-single');
  other = await make('b-single');
  multi = await make('c-multiple', 'validated', true);
  await make('d-draft', 'draft');
  await make('e-rejected', 'rejected');
});
afterAll(async () => {
  if (server) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  await prisma.$disconnect();
  rmSync(directory, { recursive: true, force: true });
});

describe('Exam workflow with a migrated SQLite database', () => {
  it('selects only validated questions and never silently reduces the requested count', async () => {
    const exam = await engine.createExam(config({ questionCount: 3 }));
    const rows = await prisma.examQuestion.findMany({ where: { examId: exam.examId }, include: { question: true } });
    expect(rows).toHaveLength(3);
    expect(rows.every(r => r.question.validationStatus === 'validated')).toBe(true);
    await expect(engine.createExam(config({ questionCount: 4 }))).rejects.toThrow('Only 3');
  });
  it('does not fall back to unrelated questions for an empty filter', async () => {
    await expect(engine.createExam(config({ mode: 'subnetting_practice' }))).rejects.toThrow('Only 0');
  });
  it('does not select two questions from the same family', async () => {
    await prisma.question.updateMany({ where: { id: { in: [question.id, other.id] } }, data: { questionFamilyId: 'same-family' } });
    await expect(engine.createExam(config({ questionCount: 3 }))).rejects.toThrow('Only 2');
  });
  it('rejects strict study mode, anonymous incorrect review and empty topic practice', async () => {
    await expect(engine.createExam(config({ studyMode: true }))).rejects.toThrow('cannot be enabled together');
    await expect(engine.createExam(config({ mode: 'incorrect_review' }))).rejects.toThrow('Sign in');
    await expect(engine.createExam(config({ mode: 'topic_practice' }))).rejects.toThrow('Select at least');
  });
  it('persists the deadline across restart and recovery requests', async () => {
    const a = await attempt();
    const first = await engine.getExamState(a.id);
    const again = await engine.startExam(a.id);
    expect(again.expiresAt).toBe(first.expiresAt);
    expect(again.startedAt).toBe(first.startedAt);
  });
  it('does not reveal solutions in current questions or strict answer feedback', async () => {
    const a = await attempt({ showExplanations: true });
    const payload = JSON.stringify(a.question);
    expect(payload).not.toContain('isCorrect');
    expect(payload).not.toContain('explanation');
    const result = await engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id]);
    expect(result).toEqual({ confirmed: true, nextQuestionIndex: 1 });
  });
  it('rejects empty, duplicate and foreign selections without advancing', async () => {
    const a = await attempt();
    for (const selected of [[], [question.options[0].id, question.options[0].id], [other.options[0].id]]) {
      await expect(engine.submitAnswer(a.id, a.question.examQuestionId, selected)).rejects.toThrow();
    }
    expect((await engine.getExamState(a.id)).answeredCount).toBe(0);
  });
  it('enforces exactly the required multiple choice count', async () => {
    const a = await attempt({ questionCount: 3 });
    for (const q of [question, other]) {
      const current = await engine.getCurrentQuestion(a.id);
      await engine.submitAnswer(a.id, current.examQuestionId, [q.options[0].id]);
    }
    const current = await engine.getCurrentQuestion(a.id);
    await expect(engine.submitAnswer(a.id, current.examQuestionId, [multi.options[0].id])).rejects.toThrow('exactly 2');
    await engine.submitAnswer(a.id, current.examQuestionId, multi.options.slice(0, 2).map((o: any) => o.id));
    expect((await calculateResults(a.id)).correctCount).toBe(3);
  });
  it('does not accept another question or a repeated confirmation', async () => {
    const a = await attempt({ questionCount: 2 });
    const later = await prisma.examQuestion.findFirstOrThrow({ where: { examId: a.id, questionOrder: 1 } });
    await expect(engine.submitAnswer(a.id, later.id, [other.options[0].id])).rejects.toThrow('Strict mode');
    await engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id]);
    await expect(engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[1].id])).rejects.toThrow();
    expect(await prisma.examResponse.count()).toBe(1);
  });
  it('blocks results and review both before starting and while in progress', async () => {
    const exam = await engine.createExam(config());
    for (const phase of ['configured', 'in_progress']) {
      if (phase === 'in_progress') await engine.startExam(exam.examId);
      expect((await request(`/exams/${exam.examId}/results`)).status).toBe(403);
      expect((await request(`/exams/${exam.examId}/review`)).status).toBe(403);
    }
    expect((await engine.getExamState(exam.examId)).status).toBe('in_progress');
  });
  it('expires using server time and counts remaining questions as unanswered', async () => {
    const a = await attempt({ questionCount: 2 });
    const deadline = new Date(Date.now() - 1000);
    await prisma.exam.update({ where: { id: a.id }, data: { startedAt: new Date(deadline.getTime() - 60000), expiresAt: deadline } });
    await expect(engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id])).rejects.toThrow('expired');
    const result = await calculateResults(a.id);
    expect(result.unansweredCount).toBe(2);
    expect(result.totalTimeSeconds).toBe(60);
    expect((await prisma.exam.findUniqueOrThrow({ where: { id: a.id } })).status).toBe('expired');
  });
  it('finishes, scores exact matches and exposes review only after completion', async () => {
    const a = await attempt();
    await engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id]);
    const result = await calculateResults(a.id);
    expect(result.percentage).toBe(100);
    expect(result.correctCount).toBe(1);
    expect((await getExamReview(a.id))[0].isCorrect).toBe(true);
  });
  it('protects account exams and full question answers from other users', async () => {
    const user = await prisma.user.create({ data: { email: 'owner@test.local', username: 'owner', passwordHash: 'test-only' } });
    const exam = await engine.createExam(config(), user.id);
    expect((await request(`/exams/${exam.examId}`)).status).toBe(403);
    const token = generateToken({ id: user.id, email: user.email, username: user.username, role: user.role, language: user.language });
    expect((await request(`/exams/${exam.examId}`, 'GET', undefined, token)).status).toBe(200);
    expect((await request(`/questions/${question.id}`)).status).toBe(401);
    expect((await request(`/questions/${question.id}`, 'GET', undefined, token)).status).toBe(403);
  });
  it('accepts only one of two concurrent confirmations', async () => {
    const a = await attempt({ questionCount: 2 });
    const results = await Promise.allSettled([
      engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id]),
      engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[1].id]),
    ]);
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
    expect(await prisma.examResponse.count()).toBe(1);
    expect((await engine.getExamState(a.id)).currentQuestionIndex).toBe(1);
  });
  it('marks every selection in an incorrect multiple answer as incorrect for analytics', async () => {
    await prisma.question.updateMany({ where: { id: { in: [question.id, other.id] } }, data: { validationStatus: 'draft' } });
    const a = await attempt();
    await engine.submitAnswer(a.id, a.question.examQuestionId, [multi.options[0].id, multi.options[2].id]);
    expect((await calculateResults(a.id)).incorrectCount).toBe(1);
    expect((await prisma.examResponse.findMany()).every(r => r.isCorrect === false)).toBe(true);
  });
  it('returns immediate explanations in study mode only', async () => {
    const a = await attempt({ studyMode: true, strictMode: false, showExplanations: true });
    const feedback = await engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id]);
    expect(feedback.isCorrect).toBe(true);
    expect(feedback.explanation).toBe('Technical explanation');
    expect(feedback.correctOptionIds).toEqual([question.options[0].id]);
  });
  it.each([false, true])('honors showExplanations=%s on submission and revisiting while preserving final review', async showExplanations => {
    const a = await attempt({ questionCount: 2, studyMode: true, strictMode: false, showExplanations });
    const feedback = await engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id]);
    expect(feedback.isCorrect).toBe(true);
    expect(feedback.explanation).toBe(showExplanations ? 'Technical explanation' : undefined);
    const recovered = await engine.getCurrentQuestion(a.id, 0);
    expect(recovered.feedback?.explanation).toBe(showExplanations ? 'Technical explanation' : undefined);
    expect((await engine.getExamState(a.id)).config.showExplanations).toBe(showExplanations);
    await engine.completeExam(a.id);
    expect((await getExamReview(a.id))[0].explanation).toBe('Technical explanation');
  });
  it('preserves immediate explanations for old study sessions without saved settings', async () => {
    const a = await attempt({ questionCount: 2, studyMode: true, strictMode: false });
    await prisma.exam.update({ where: { id: a.id }, data: { settings: null } });
    const feedback = await engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id]);
    expect(feedback.explanation).toBe('Technical explanation');
    expect((await engine.getCurrentQuestion(a.id, 0)).feedback?.explanation).toBe('Technical explanation');
  });
  it('persists all submitted settings and creates an untimed study session', async () => {
    const a = await attempt({ studyMode: true, strictMode: false, untimed: true, soundEnabled: false, groupByTopic: true });
    const state = await engine.getExamState(a.id);
    expect(state.expiresAt).toBeNull();
    expect(state.config).toMatchObject({ untimed: true, soundEnabled: false, randomize: false, groupByTopic: true });
    expect(await engine.checkExpiry(a.id)).toBe(false);
    await engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id]);
    expect((await calculateResults(a.id)).correctCount).toBe(1);
    await expect(engine.createExam(config({ untimed: true }))).rejects.toThrow('requires study mode');
  });
  it('lets study users revisit answered questions without changing confirmed responses', async () => {
    const a = await attempt({ questionCount: 3, studyMode: true, strictMode: false });
    await expect(engine.getCurrentQuestion(a.id, 2)).rejects.toThrow('Only the current');
    await engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id]);
    const prior = await engine.getCurrentQuestion(a.id, 0);
    expect(prior.feedback?.isCorrect).toBe(true);
    expect(prior.selectedOptionIds).toEqual([question.options[0].id]);
    await expect(engine.submitAnswer(a.id, prior.examQuestionId, [question.options[1].id])).rejects.toThrow('already');
    const current = await engine.getCurrentQuestion(a.id, 1);
    expect(current.feedback).toBeUndefined();
    expect((await engine.getExamState(a.id)).currentQuestionIndex).toBe(1);
  });
  it('rejects indexed strict-mode navigation and invalid indexes over HTTP', async () => {
    const a = await attempt({ questionCount: 2 });
    expect((await request(`/exams/${a.id}/question?index=1`)).status).toBe(403);
    for (const index of ['-1', 'abc', '0.5', '10']) {
      expect((await request(`/exams/${a.id}/question?index=${index}`)).status).toBe(400);
    }
  });
  it('keeps favorites private, idempotent and filterable', async () => {
    async function register(name: string) {
      const response = await request('/users/register', 'POST', { email: name + '@example.test', username: name, password: 'test-password-123' });
      expect(response.status).toBe(201);
      return response.body.data.token;
    }
    const owner = await register('favoriteowner');
    const otherUser = await register('favoriteother');
    expect((await request(`/questions/${question.id}/favorite`, 'PUT')).status).toBe(401);
    for (let i = 0; i < 2; i++) expect((await request(`/questions/${question.id}/favorite`, 'PUT', undefined, owner)).status).toBe(200);
    expect(await prisma.questionFavorite.count()).toBe(1);
    expect((await request('/users/me/favorites', 'GET', undefined, owner)).body.data).toEqual([question.id]);
    expect((await request('/users/me/favorites', 'GET', undefined, otherUser)).body.data).toEqual([]);
    expect((await request('/questions?favoritesOnly=true', 'GET', undefined, owner)).body.data).toHaveLength(1);
    expect((await request('/questions?favoritesOnly=true')).status).toBe(401);
    await request(`/questions/${question.id}/favorite`, 'DELETE', undefined, otherUser);
    expect(await prisma.questionFavorite.count()).toBe(1);
    await request(`/questions/${question.id}/favorite`, 'DELETE', undefined, owner);
    expect(await prisma.questionFavorite.count()).toBe(0);
  });
  it('requires documented human technical review and records the reviewer', async () => {
    const admin = await prisma.user.create({ data: { email: 'reviewer@example.test', username: 'reviewer', passwordHash: 'test-only', role: 'admin' } });
    const token = generateToken({ id: admin.id, email: admin.email, username: admin.username, role: admin.role, language: admin.language });
    await prisma.question.update({ where: { id: question.id }, data: { validationStatus: 'pending_review' } });
    const path = `/questions/${question.id}/review`;
    const input = { status: 'validated', notes: 'Checked the concept and both translations against the reference.' };
    expect((await request(path, 'POST', input)).status).toBe(401);
    expect((await request(path, 'POST', input, token)).status).toBe(400);
    expect((await request(`/questions/${question.id}`, 'PUT', { validationStatus: 'validated' }, token)).status).toBe(400);
    expect(await prisma.questionReview.count()).toBe(0);
    const approved = await request(path, 'POST', { ...input, evidenceUrl: 'https://www.rfc-editor.org/rfc/rfc791', technicalReviewConfirmed: true }, token);
    expect(approved.status).toBe(200);
    expect((await prisma.questionReview.findFirstOrThrow()).reviewerId).toBe(admin.id);
    expect((await prisma.question.findUniqueOrThrow({ where: { id: question.id } })).lastVerifiedAt).not.toBeNull();
    expect((await request(`/questions/${question.id}/reviews`, 'GET', undefined, token)).body.data).toHaveLength(1);
    await request(`/questions/${question.id}`, 'PUT', { explanationEn: 'Edited explanation requires another review.' }, token);
    const edited = await prisma.question.findUniqueOrThrow({ where: { id: question.id } });
    expect(edited.validationStatus).toBe('pending_review');
    expect(edited.lastVerifiedAt).toBeNull();
    expect(await prisma.questionReview.count()).toBe(1);
  });
  it('combines topic, search and type filters rather than replacing them', async () => {
    const match = await request('/questions?topic=network_fundamentals&search=single&questionType=single_choice');
    expect(match.body.data).toHaveLength(2);
    expect((await request('/questions?topic=network_access&search=single')).body.data).toHaveLength(0);
  });
  it('builds a bilingual adaptive plan from exact answers and measured response times', async () => {
    const user = await prisma.user.create({ data: { email: 'learner@example.test', username: 'learner', passwordHash: 'test-only', language: 'es' } });
    const token = generateToken({ id: user.id, email: user.email, username: user.username, role: user.role, language: user.language });
    for (let i = 0; i < 2; i++) {
      const a = await engine.createExam(config(), user.id);
      await engine.startExam(a.examId);
      const q = await engine.getCurrentQuestion(a.examId);
      await engine.submitAnswer(a.examId, q.examQuestionId, [question.options[1].id]);
      await prisma.examQuestion.update({ where: { id: q.examQuestionId }, data: { timeSpentSeconds: 200 } });
    }
    const response = await request('/users/me/learning-profile?language=es', 'GET', undefined, token);
    const profile = response.body.data;
    expect(profile.overallProgress.totalExams).toBe(2);
    expect(profile.overallProgress.overallAccuracy).toBe(0);
    expect(profile.repeatedErrors[0].topicName).toBe('Redes');
    expect(profile.slowTopics).toEqual(['Redes']);
    const networks = profile.studyPlan.find((p: any) => p.area === 'network_fundamentals');
    expect(networks.focusTopics).toEqual(['Redes']);
    expect(networks.message).toContain('Tu precisión');
    expect(profile.studyPlan.filter((p: any) => p.area !== 'network_fundamentals').every((p: any) => p.focusTopics.length === 0)).toBe(true);
    expect((await request('/users/me/learning-profile')).status).toBe(401);
  });
  it('reports eligible availability without creating an exam', async () => {
    const response = await request('/exams/availability', 'POST', { mode: 'custom', difficulty: 'basic' });
    expect(response.body.data.available).toBe(3);
    expect(await prisma.exam.count()).toBe(0);
    const empty = await request('/exams/availability', 'POST', { mode: 'subnetting_practice' });
    expect(empty.body.data.available).toBe(0);
  });
  it('loads the original batch as pending and retries without duplicates or overwriting edits', async () => {
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    const batchFile = resolve(__dirname, '../prisma/questions/original_20261024_50.json');
    const areas = ['network_access', 'ip_connectivity', 'ip_services', 'security_fundamentals', 'automation_programmability'];
    for (const [i, area] of areas.entries()) await prisma.topic.create({ data: { code: `${i+2}.0`, nameEn: area, nameEs: area, examArea: area, examAreaNumber: `${i+2}.0`, weightPercentage: 10 } });
    expect(await loadOriginalBatch(batchFile, prisma)).toMatchObject({ created: 50, unchanged: 0, automaticallyApproved: 0 });
    const added = await prisma.question.findMany({ where: { id: { startsWith: 'ccna-original-20261024-' } } });
    expect(added).toHaveLength(50);
    expect(added.every(q => q.validationStatus === 'pending_review' && q.lastVerifiedAt === null)).toBe(true);
    expect(await loadOriginalBatch(batchFile, prisma)).toMatchObject({ created: 0, unchanged: 50 });
    const id = 'ccna-original-20261024-001';
    await prisma.question.update({ where: { id }, data: { explanationEn: 'An editorial correction that must be preserved.' } });
    await expect(loadOriginalBatch(batchFile, prisma)).rejects.toThrow('refusing to overwrite');
    expect((await prisma.question.findUniqueOrThrow({ where: { id } })).explanationEn).toBe('An editorial correction that must be preserved.');
    expect(await prisma.question.count()).toBe(55);
    const configured = await request('/exams/availability', 'POST', { mode: 'custom' });
    expect(configured.body.data.available).toBe(3);
  });
  it('rolls back the batch import if a required topic is missing', async () => {
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    await expect(loadOriginalBatch(resolve(__dirname, '../prisma/questions/original_20261024_50.json'), prisma)).rejects.toThrow('No root topic');
    expect(await prisma.question.count({ where: { id: { startsWith: 'ccna-original-20261024-' } } })).toBe(0);
    expect(await prisma.question.count()).toBe(5);
  });
  it('retains presented content, labels, scoring and explanations after live-bank edits', async () => {
    const a = await attempt();
    const displayed = await engine.getCurrentQuestion(a.id);
    const row = await prisma.examQuestion.findUniqueOrThrow({ where: { id: a.question.examQuestionId } });
    expect(row.contentSnapshot).not.toBeNull();
    await prisma.question.update({ where: { id: question.id }, data: { statementEn: 'Edited question after configuration', explanationEn: 'Edited explanation', difficulty: 'advanced' } });
    await prisma.questionOption.update({ where: { id: question.options[0].id }, data: { isCorrect: false, optionTextEn: 'Edited option' } });
    await prisma.questionOption.update({ where: { id: question.options[1].id }, data: { isCorrect: true } });
    expect(await engine.getCurrentQuestion(a.id)).toEqual(displayed);
    await engine.submitAnswer(a.id, displayed.examQuestionId, [question.options[0].id]);
    expect((await calculateResults(a.id)).correctCount).toBe(1);
    const review = (await getExamReview(a.id))[0];
    expect(review.statement).toBe('Test a-single');
    expect(review.explanation).toBe('Technical explanation');
    expect(review.historicalContentPreserved).toBe(true);
    expect(review.options.map(o => o.id)).toEqual(displayed.options.map(o => o.id));
    expect(review.correctOptionLabels).toEqual([displayed.options.find(o => o.id === question.options[0].id)!.label]);
  });
  it('creates a pending revision without losing original options or account history', async () => {
    const admin = await prisma.user.create({ data: { email: 'versioner@example.test', username: 'versioner', passwordHash: 'test-only', role: 'admin' } });
    const token = generateToken({ id: admin.id, email: admin.email, username: admin.username, role: admin.role, language: admin.language });
    const a = await attempt();
    await engine.submitAnswer(a.id, a.question.examQuestionId, [question.options[0].id]);
    const options = question.options.map((o: any) => ({ optionLabel: o.optionLabel, optionTextEn: o.optionTextEn + ' revised', optionTextEs: o.optionTextEs + ' revisada', isCorrect: o.isCorrect, displayOrder: o.displayOrder }));
    const blocked = await request(`/questions/${question.id}`, 'PUT', { options }, token);
    expect(blocked.status).toBe(409);
    expect((await request(`/questions/${question.id}/revisions`, 'POST', { options })).status).toBe(401);
    const revised = await request(`/questions/${question.id}/revisions`, 'POST', { statementEn: 'A separate revised question', options }, token);
    expect(revised.status).toBe(201);
    expect(revised.body.data.id).not.toBe(question.id);
    const original = await prisma.question.findUniqueOrThrow({ where: { id: question.id } });
    const revision = await prisma.question.findUniqueOrThrow({ where: { id: revised.body.data.id } });
    expect(original.statementEn).toBe('Test a-single');
    expect(original.questionFamilyId).toBe(revision.questionFamilyId);
    expect(revision.validationStatus).toBe('pending_review');
    expect((await calculateResults(a.id)).correctCount).toBe(1);
    expect((await getExamReview(a.id))[0].historicalContentPreserved).toBe(true);
  });
  it('marks older uncaptured reviews and refuses corrupt captured content', async () => {
    const a = await attempt();
    const row = await prisma.examQuestion.findUniqueOrThrow({ where: { id: a.question.examQuestionId } });
    const snapshot = JSON.parse(row.contentSnapshot!); snapshot.question.statementEn = 'Tampered';
    await prisma.examQuestion.update({ where: { id: row.id }, data: { contentSnapshot: JSON.stringify(snapshot) } });
    await expect(engine.getCurrentQuestion(a.id)).rejects.toThrow('integrity check');
    await prisma.examQuestion.update({ where: { id: row.id }, data: { contentSnapshot: null } });
    await engine.submitAnswer(a.id, row.id, [question.options[0].id]);
    expect((await getExamReview(a.id))[0].historicalContentPreserved).toBe(false);
  });
  it('imports a second batch with shared families and consulted references without approving it', async () => {
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    for (const [i, area] of ['network_access', 'ip_connectivity', 'ip_services', 'security_fundamentals', 'automation_programmability'].entries()) {
      await prisma.topic.create({ data: { code: `${i+2}.0`, nameEn: area, nameEs: area, examArea: area, examAreaNumber: `${i+2}.0`, weightPercentage: 10 } });
    }
    const path = resolve(__dirname, '../prisma/questions/original_20261024_b02_50.json');
    expect(await loadOriginalBatch(path, prisma)).toMatchObject({ created: 50, automaticallyApproved: 0 });
    expect(await loadOriginalBatch(path, prisma)).toMatchObject({ created: 0, unchanged: 50 });
    expect(await prisma.question.count({ where: { validationStatus: 'validated' } })).toBe(3);
    const group = await prisma.question.findMany({ where: { questionFamilyId: 'concept-ipv6-minimum-link-mtu' } });
    expect(group).toHaveLength(2);
    expect(group.every(q => q.validationStatus === 'pending_review')).toBe(true);
  });
  it('loads the third batch once, preserving related families and explicit pending approval', async () => {
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    for (const [i, area] of ['network_access', 'ip_connectivity', 'ip_services', 'security_fundamentals', 'automation_programmability'].entries()) {
      await prisma.topic.create({ data: { code: `${i+2}.0`, nameEn: area, nameEs: area, examArea: area, examAreaNumber: `${i+2}.0`, weightPercentage: 10 } });
    }
    const file = resolve(__dirname, '../prisma/questions/original_20261024_b03_50.json');
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 50, automaticallyApproved: 0 });
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 0, unchanged: 50 });
    const rows = await prisma.question.findMany({ where: { id: { startsWith: 'ccna-original-20261024-b03-' } } });
    expect(rows).toHaveLength(50);
    expect(rows.every(q => q.validationStatus === 'pending_review' && !q.lastVerifiedAt)).toBe(true);
    expect(rows.filter(q => q.questionType === 'multiple_choice')).toHaveLength(10);
    expect(rows.filter(q => q.questionType === 'true_false')).toHaveLength(1);
    expect(rows.filter(q => q.questionFamilyId === 'concept-tcp-sequence-space')).toHaveLength(2);
  });
  it('imports the fourth batch idempotently and keeps every candidate out of scoring selection', async () => {
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    for (const [i, area] of ['network_access', 'ip_connectivity', 'ip_services', 'security_fundamentals', 'automation_programmability'].entries()) {
      await prisma.topic.create({ data: { code: `${i+2}.0`, nameEn: area, nameEs: area, examArea: area, examAreaNumber: `${i+2}.0`, weightPercentage: 10 } });
    }
    const file = resolve(__dirname, '../prisma/questions/original_20261026_b04_50.json');
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 50, automaticallyApproved: 0 });
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 0, unchanged: 50 });
    const rows = await prisma.question.findMany({ where: { id: { startsWith: 'ccna-original-20261026-b04-' } } });
    expect(rows).toHaveLength(50);
    expect(rows.every(q => q.validationStatus === 'pending_review' && !q.lastVerifiedAt)).toBe(true);
    await expect(engine.createExam(config({ questionCount: 4 }))).rejects.toThrow('Only 3');
    const exam = await engine.createExam(config({ questionCount: 3 }));
    const selected = await prisma.examQuestion.findMany({ where: { examId: exam.examId } });
    expect(selected.every(q => !q.questionId.startsWith('ccna-original-20261026-b04-'))).toBe(true);
  });
  it('loads the fifth documented batch once and keeps machine review separate from scoring approval', async () => {
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    for (const [i, area] of ['network_access', 'ip_connectivity', 'ip_services', 'security_fundamentals', 'automation_programmability'].entries()) {
      await prisma.topic.create({ data: { code: `${i+2}.0`, nameEn: area, nameEs: area, examArea: area, examAreaNumber: `${i+2}.0`, weightPercentage: 10 } });
    }
    const file = resolve(__dirname, '../prisma/questions/original_20261026_b05_50.json');
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 50, automaticallyApproved: 0 });
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 0, unchanged: 50 });
    const rows = await prisma.question.findMany({ where: { id: { startsWith: 'ccna-original-20261026-b05-' } } });
    expect(rows).toHaveLength(50);
    expect(rows.every(q => q.validationStatus === 'pending_review' && !q.lastVerifiedAt)).toBe(true);
    expect(rows.filter(q => q.questionType === 'multiple_choice')).toHaveLength(5);
    await expect(engine.createExam(config({ questionCount: 4 }))).rejects.toThrow('Only 3');
  });
  it('loads the sixth reviewed batch without duplicates or automatic scoring approval', async () => {
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    for (const [i, area] of ['network_access', 'ip_connectivity', 'ip_services', 'security_fundamentals', 'automation_programmability'].entries()) {
      await prisma.topic.create({ data: { code: `${i+2}.0`, nameEn: area, nameEs: area, examArea: area, examAreaNumber: `${i+2}.0`, weightPercentage: 10 } });
    }
    const file = resolve(__dirname, '../prisma/questions/original_20261026_b06_50.json');
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 50, automaticallyApproved: 0 });
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 0, unchanged: 50 });
    const rows = await prisma.question.findMany({ where: { id: { startsWith: 'ccna-original-20261026-b06-' } } });
    expect(rows).toHaveLength(50);
    expect(rows.every(q => q.validationStatus === 'pending_review' && !q.lastVerifiedAt)).toBe(true);
    await expect(engine.createExam(config({ questionCount: 4 }))).rejects.toThrow('Only 3');
  });
  it('loads the seventh reviewed batch idempotently while preserving the scoring approval boundary', async () => {
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    for (const [i, area] of ['network_access', 'ip_connectivity', 'ip_services', 'security_fundamentals', 'automation_programmability'].entries()) {
      await prisma.topic.create({ data: { code: `${i+2}.0`, nameEn: area, nameEs: area, examArea: area, examAreaNumber: `${i+2}.0`, weightPercentage: 10 } });
    }
    const file = resolve(__dirname, '../prisma/questions/original_20261026_b07_50.json');
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 50, automaticallyApproved: 0 });
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 0, unchanged: 50 });
    const rows = await prisma.question.findMany({ where: { id: { startsWith: 'ccna-original-20261026-b07-' } } });
    expect(rows).toHaveLength(50);
    expect(rows.every(q => q.validationStatus === 'pending_review' && !q.lastVerifiedAt)).toBe(true);
    await expect(engine.createExam(config({ questionCount: 4 }))).rejects.toThrow('Only 3');
  });
  it('loads an explicitly declared ten-question batch without padding or approval', async () => {
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    for (const [i, area] of ['security_fundamentals', 'automation_programmability'].entries()) {
      await prisma.topic.create({ data: { code: `${i+5}.0`, nameEn: area, nameEs: area, examArea: area, examAreaNumber: `${i+5}.0`, weightPercentage: 10 } });
    }
    const file = resolve(__dirname, '../prisma/questions/original_20261026_b08_10.json');
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ received: 10, created: 10, automaticallyApproved: 0 });
    expect(await loadOriginalBatch(file, prisma)).toMatchObject({ created: 0, unchanged: 10 });
    expect(await prisma.question.count({ where: { id: { startsWith: 'ccna-original-20261026-b08-' }, validationStatus: 'pending_review' } })).toBe(10);
    await expect(engine.createExam(config({ questionCount: 4 }))).rejects.toThrow('Only 3');
  });
  it.each([9, 11])('rejects %s questions when the declared batch size is ten before importing', async count => {
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    const { readFileSync } = await import('node:fs');
    const input = JSON.parse(readFileSync(resolve(__dirname, '../prisma/questions/original_20261026_b08_10.json'), 'utf8'));
    input.questions = count === 9 ? input.questions.slice(0, 9) : [...input.questions, input.questions[0]];
    const file = join(directory, `wrong-size-${count}.json`); writeFileSync(file, JSON.stringify(input));
    await expect(loadOriginalBatch(file, prisma)).rejects.toThrow('declared batch size');
    expect(await prisma.question.count()).toBe(5);
  });
  it('serves a database-backed health check and question list', async () => {
    const health = await request('/health');
    expect(health.body.data.db).toBe('connected');
    const topics = await request('/topics');
    expect(topics.body.data).toHaveLength(1);
    const questions = await request('/questions');
    expect(questions.body.data).toHaveLength(5);
  });
});

describe('Final functional audit: administration and security', () => {
  async function admin() {
    const user = await prisma.user.create({ data: { email: 'audit-admin@example.test', username: 'audit-admin', passwordHash: 'unused', role: 'admin', language: 'es' } });
    return { user, token: generateToken(user) };
  }
  const draft = () => ({
    statementEn: 'Audit fixture: which address length belongs to IPv4?',
    statementEs: 'Prueba de auditoría: ¿qué longitud corresponde a IPv4?',
    questionType: 'single_choice', difficulty: 'basic', primaryTopicId: question.primaryTopicId,
    validationStatus: 'pending_review', explanationEn: 'IPv4 addresses contain 32 bits.',
    explanationEs: 'Las direcciones IPv4 contienen 32 bits.', sourceUrl: 'https://www.rfc-editor.org/rfc/rfc791', sourceLicense: 'Original test fixture',
    options: ['32', '128', '64'].map((value, i) => ({ optionLabel: String.fromCharCode(65 + i), optionTextEn: value, optionTextEs: value, isCorrect: i === 0 })),
  });
  it('creates an ordered bilingual pending candidate, blocks duplicates and never auto-approves', async () => {
    const { token } = await admin();
    expect((await request('/questions', 'POST', draft())).status).toBe(401);
    const created = await request('/questions', 'POST', draft(), token);
    expect(created.status).toBe(201);
    expect(created.body.data.validationStatus).toBe('pending_review');
    expect(created.body.data.options.map((option: any) => option.displayOrder)).toEqual([0, 1, 2]);
    expect(created.body.data.sourceLicense).toBe('Original test fixture');
    expect((await request('/questions', 'POST', draft(), token)).status).toBe(409);
    expect((await request('/questions', 'POST', { ...draft(), difficulty: 'mixed' }, token)).status).toBe(400);
    await expect(engine.createExam(config({ questionCount: 4 }))).rejects.toThrow('Only 3');
  });
  it('revokes administrator access immediately and rejects tokens for deleted users', async () => {
    const { user, token } = await admin();
    expect((await request('/questions/' + question.id, 'GET', undefined, token)).status).toBe(200);
    await prisma.user.update({ where: { id: user.id }, data: { role: 'user' } });
    expect((await request('/questions/' + question.id, 'GET', undefined, token)).status).toBe(403);
    expect((await request('/questions', 'POST', draft(), token)).status).toBe(403);
    await prisma.user.delete({ where: { id: user.id } });
    expect((await request('/questions/' + question.id, 'GET', undefined, token)).status).toBe(401);
  });
  it('bootstraps an administrator without resetting passwords or promoting existing users', async () => {
    const { bootstrapAdmin } = await import('../prisma/bootstrap-admin');
    expect(await bootstrapAdmin(prisma)).toEqual({ status: 'skipped' });
    await expect(bootstrapAdmin(prisma, 'bootstrap@example.test')).rejects.toThrow('both');
    await expect(bootstrapAdmin(prisma, 'bootstrap@example.test', 'short')).rejects.toThrow('12');
    expect(await bootstrapAdmin(prisma, 'bootstrap@example.test', 'audit-strong-password')).toEqual({ status: 'created' });
    const before = await prisma.user.findUniqueOrThrow({ where: { email: 'bootstrap@example.test' } });
    expect(before.role).toBe('admin');
    expect(await bootstrapAdmin(prisma, 'bootstrap@example.test', 'different-strong-password')).toEqual({ status: 'unchanged' });
    expect((await prisma.user.findUniqueOrThrow({ where: { id: before.id } })).passwordHash).toBe(before.passwordHash);
    await prisma.user.update({ where: { id: before.id }, data: { role: 'user' } });
    await expect(bootstrapAdmin(prisma, before.email, 'another-strong-password')).rejects.toThrow('non-admin');
    expect((await prisma.user.findUniqueOrThrow({ where: { id: before.id } })).role).toBe('user');
  });
  it('rejects foreign browser origins and only permits configured production origins', async () => {
    const { allowedOrigin } = await import('../src/lib/corsPolicy');
    expect(allowedOrigin('https://app.example', ['https://app.example'], false)).toBe(true);
    expect(allowedOrigin('http://localhost:5173', [], false)).toBe(false);
    expect(allowedOrigin('http://localhost.evil.test', [], true)).toBe(false);
    expect(allowedOrigin('http://127.0.0.1:5175', [], true)).toBe(true);
    const rejected = await fetch(base + '/health', { headers: { Origin: 'https://foreign.example' } });
    expect(rejected.status).toBe(403);
    expect(rejected.headers.get('access-control-allow-origin')).toBeNull();
  });
  it('rejects conflicting untimed study and per-question timers', async () => {
    await expect(engine.createExam(config({ studyMode: true, strictMode: false, untimed: true, perQuestionTimeLimit: 30 }))).rejects.toThrow('Untimed study');
    expect(await prisma.exam.count()).toBe(0);
  });
});

describe('Account privacy audit', () => {
  it('clears only the authenticated account attempts, preserving other users and favorites', async () => {
    const a = await prisma.user.create({ data: { email: 'owner-a@example.test', username: 'owner-a', passwordHash: 'unused', role: 'user', language: 'es' } });
    const b = await prisma.user.create({ data: { email: 'owner-b@example.test', username: 'owner-b', passwordHash: 'unused', role: 'user', language: 'es' } });
    const own = await engine.createExam(config(), a.id);
    const foreign = await engine.createExam(config(), b.id);
    await prisma.questionFavorite.create({ data: { userId: a.id, questionId: question.id } });
    expect((await request('/users/me/history', 'DELETE')).status).toBe(401);
    expect((await request('/users/me/history', 'DELETE', undefined, generateToken(a))).status).toBe(200);
    expect(await prisma.exam.findUnique({ where: { id: own.examId } })).toBeNull();
    expect(await prisma.exam.findUnique({ where: { id: foreign.examId } })).not.toBeNull();
    expect(await prisma.questionFavorite.count({ where: { userId: a.id } })).toBe(1);
  });
  it('public registration cannot assign administrator privileges', async () => {
    const registered = await request('/users/register', 'POST', { email: 'ordinary@example.test', username: 'ordinary', password: 'ordinary-test-password', role: 'admin' });
    expect(registered.status).toBe(201);
    expect(registered.body.data.user.role).toBe('user');
  });
});

describe('Independent study exercise restart', () => {
  async function answeredStudy() {
    const session = await attempt({ questionCount: 2, studyMode: true, strictMode: false, untimed: true, showExplanations: false, soundEnabled: false });
    await engine.submitAnswer(session.id, session.question.examQuestionId, [question.options[0].id]);
    return session;
  }
  it('creates a fresh single-question study attempt without changing original answers or capture', async () => {
    const source = await answeredStudy();
    const before = await prisma.examQuestion.findUniqueOrThrow({ where: { id: source.question.examQuestionId }, include: { responses: true } });
    const fresh = await engine.restartStudyExercise(source.id, before.id);
    expect(fresh.examId).not.toBe(source.id);
    expect(fresh.config).toMatchObject({ studyMode: true, strictMode: false, untimed: true, questionCount: 1, showExplanations: false, soundEnabled: false, practiceSourceExamId: source.id });
    expect(fresh.answeredCount).toBe(0);
    await engine.startExam(fresh.examId);
    const displayed = await engine.getCurrentQuestion(fresh.examId);
    expect(displayed.id).toBe(question.id);
    expect(displayed).not.toHaveProperty('feedback');
    expect(displayed).not.toHaveProperty('selectedOptionIds');
    expect(JSON.stringify(displayed)).not.toContain('isCorrect');
    expect((await engine.getExamState(fresh.examId)).expiresAt).toBeNull();
    await engine.submitAnswer(fresh.examId, displayed.examQuestionId, [question.options[1].id]);
    expect(await prisma.examQuestion.findUniqueOrThrow({ where: { id: before.id }, include: { responses: true } })).toEqual(before);
  });
  it('uses currently approved content and preserves the historical captured version', async () => {
    const source = await answeredStudy();
    await prisma.question.update({ where: { id: question.id }, data: { statementEn: 'Current approved version for restarting' } });
    const fresh = await engine.restartStudyExercise(source.id, source.question.examQuestionId);
    await engine.startExam(fresh.examId);
    expect((await engine.getCurrentQuestion(fresh.examId)).statement).toBe('Current approved version for restarting');
    expect((await engine.getCurrentQuestion(source.id, 0)).statement).toBe('Test a-single');
  });
  it('rejects withdrawn questions without creating an attempt', async () => {
    const source = await answeredStudy();
    await prisma.question.update({ where: { id: question.id }, data: { validationStatus: 'pending_review' } });
    await expect(engine.restartStudyExercise(source.id, source.question.examQuestionId)).rejects.toThrow('no longer eligible');
    expect(await prisma.exam.count()).toBe(1);
  });
  it('rejects unanswered exercises, strict attempts and foreign questions', async () => {
    const study = await attempt({ studyMode: true, strictMode: false });
    await expect(engine.restartStudyExercise(study.id, study.question.examQuestionId)).rejects.toThrow('Confirm');
    const strict = await attempt();
    await expect(engine.restartStudyExercise(strict.id, strict.question.examQuestionId)).rejects.toThrow('study attempt');
    await expect(engine.restartStudyExercise(study.id, strict.question.examQuestionId)).rejects.toThrow('does not belong');
    expect(await prisma.exam.count()).toBe(2);
  });
  it('supports completed study attempts without changing their stored results', async () => {
    const source = await answeredStudy();
    await engine.completeExam(source.id);
    const before = await prisma.exam.findUniqueOrThrow({ where: { id: source.id } });
    const fresh = await engine.restartStudyExercise(source.id, source.question.examQuestionId);
    expect(fresh.answeredCount).toBe(0);
    expect(await prisma.exam.findUniqueOrThrow({ where: { id: source.id } })).toEqual(before);
  });
  it('allows only the owner over HTTP and preserves ownership in the new attempt', async () => {
    const owner = await prisma.user.create({ data: { email: 'restart-owner@example.test', username: 'restart-owner', passwordHash: 'unused', role: 'user', language: 'en' } });
    const admin = await prisma.user.create({ data: { email: 'restart-admin@example.test', username: 'restart-admin', passwordHash: 'unused', role: 'admin', language: 'en' } });
    const source = await answeredStudy();
    await prisma.exam.update({ where: { id: source.id }, data: { userId: owner.id } });
    const body = { examQuestionId: source.question.examQuestionId };
    expect((await request(`/exams/${source.id}/restart-exercise`, 'POST', body)).status).toBe(403);
    expect((await request(`/exams/${source.id}/restart-exercise`, 'POST', body, generateToken(admin))).status).toBe(403);
    const fresh = await request(`/exams/${source.id}/restart-exercise`, 'POST', body, generateToken(owner));
    expect(fresh.status).toBe(201);
    expect((await prisma.exam.findUniqueOrThrow({ where: { id: fresh.body.data.examId } })).userId).toBe(owner.id);
    expect((await request(`/exams/${source.id}/restart-exercise`, 'POST', {}, generateToken(owner))).status).toBe(400);
  });
});

describe('Server-controlled per-question deadlines', () => {
  async function timed(overrides = {}) {
    return attempt({ questionCount: 3, durationMinutes: 10, perQuestionTimeLimit: 30, ...overrides });
  }
  async function elapse(id: string) {
    await prisma.examQuestion.update({ where: { id }, data: { activatedAt: new Date(Date.now() - 31000) } });
  }
  it('persists the same deadline across reload and repeated start', async () => {
    const source = await timed();
    const row = await prisma.examQuestion.findUniqueOrThrow({ where: { id: source.question.examQuestionId } });
    const state = await engine.getExamState(source.id);
    expect(state.questionExpiresAt).toBe(new Date(row.activatedAt!.getTime() + 30000).toISOString());
    expect((await engine.startExam(source.id)).questionExpiresAt).toBe(state.questionExpiresAt);
    expect((await engine.getExamState(source.id)).questionExpiresAt).toBe(state.questionExpiresAt);
  });
  it('expires only the active question on offline recovery and gives the next question a full interval', async () => {
    const source = await timed();
    await elapse(source.question.examQuestionId);
    const state = await engine.getExamState(source.id);
    expect(state.currentQuestionIndex).toBe(1);
    expect(state.answeredCount).toBe(0);
    const old = await prisma.examQuestion.findUniqueOrThrow({ where: { id: source.question.examQuestionId }, include: { responses: true } });
    expect(old.status).toBe('timed_out');
    expect(old.responses).toHaveLength(0);
    expect(old.timeSpentSeconds).toBe(30);
    expect(new Date(state.questionExpiresAt!).getTime() - Date.now()).toBeGreaterThan(28000);
    expect((await engine.getExamState(source.id)).currentQuestionIndex).toBe(1);
    expect((await engine.getCurrentQuestion(source.id)).id).toBe(other.id);
  });
  it('rejects a late answer without storing a response or advancing twice', async () => {
    const source = await timed();
    await elapse(source.question.examQuestionId);
    const late = await request(`/exams/${source.id}/answer`, 'POST', { examQuestionId: source.question.examQuestionId, selectedOptionIds: [question.options[0].id] });
    expect(late.status).not.toBe(200);
    expect(await prisma.examResponse.count()).toBe(0);
    expect((await engine.getExamState(source.id)).currentQuestionIndex).toBe(1);
  });
  it('gives the next question its interval after confirmation and scores a timed-out final question as unanswered', async () => {
    const source = await timed({ questionCount: 2 });
    const feedback = await engine.submitAnswer(source.id, source.question.examQuestionId, [question.options[0].id]);
    const next = await engine.getCurrentQuestion(source.id);
    const state = await engine.getExamState(source.id);
    expect(feedback.questionExpiresAt).toBe(state.questionExpiresAt);
    expect(new Date(state.questionExpiresAt!).getTime() - Date.now()).toBeGreaterThan(28000);
    await elapse(next.examQuestionId);
    const finished = await engine.getExamState(source.id);
    expect(finished.status).toBe('completed');
    expect(finished.questionExpiresAt).toBeNull();
    const results = await calculateResults(source.id);
    expect(results.correctCount).toBe(1);
    expect(results.unansweredCount).toBe(1);
    expect(results.percentage).toBe(50);
  });
  it('preserves the original overall deadline and lets it close all remaining questions first', async () => {
    const source = await timed();
    const end = new Date(Date.now() - 1000);
    await prisma.exam.update({ where: { id: source.id }, data: { expiresAt: end } });
    const state = await engine.getExamState(source.id);
    expect(state.status).toBe('expired');
    expect(await prisma.examQuestion.count({ where: { examId: source.id, status: 'timed_out' } })).toBe(3);
    expect((await prisma.exam.findUniqueOrThrow({ where: { id: source.id } })).completedAt).toEqual(end);
  });
  it('does not reset the active deadline when revisiting a study answer', async () => {
    const source = await timed({ studyMode: true, strictMode: false });
    await engine.submitAnswer(source.id, source.question.examQuestionId, [question.options[0].id]);
    const state = await engine.getExamState(source.id);
    await engine.getCurrentQuestion(source.id, 0);
    expect((await engine.getExamState(source.id)).questionExpiresAt).toBe(state.questionExpiresAt);
    const next = await engine.getCurrentQuestion(source.id);
    await elapse(next.examQuestionId);
    expect((await engine.getExamState(source.id)).currentQuestionIndex).toBe(2);
  });
  it('serializes concurrent expiry checks without skipping multiple questions', async () => {
    const source = await timed();
    await elapse(source.question.examQuestionId);
    await Promise.all([engine.getExamState(source.id), engine.getExamState(source.id), engine.getExamState(source.id)]);
    expect((await engine.getExamState(source.id)).currentQuestionIndex).toBe(1);
    expect(await prisma.examQuestion.count({ where: { examId: source.id, status: 'timed_out' } })).toBe(1);
  });
  it('keeps exams without a per-question limit unchanged', async () => {
    const source = await attempt({ questionCount: 2 });
    await elapse(source.question.examQuestionId);
    const state = await engine.getExamState(source.id);
    expect(state.questionExpiresAt).toBeNull();
    expect(state.currentQuestionIndex).toBe(0);
  });
});

describe('Historical exam blueprint metadata', () => {
  it('returns the attempt version even when the current bank version changes', async () => {
    const owner = await prisma.user.create({ data: { email: 'version-owner@example.test', username: 'version-owner', passwordHash: 'unused', language: 'es' } });
    const source = await engine.createExam(config({ language: 'es' }), owner.id);
    await engine.startExam(source.examId);
    const current = await engine.getCurrentQuestion(source.examId);
    await engine.submitAnswer(source.examId, current.examQuestionId, [question.options[0].id]);
    const recorded = await prisma.exam.findUniqueOrThrow({ where: { id: source.examId } });
    const row = await prisma.examQuestion.findUniqueOrThrow({ where: { id: current.examQuestionId } });
    expect(JSON.parse(row.contentSnapshot!).question.examVersion).toBe(recorded.examVersion);
    await prisma.question.update({ where: { id: question.id }, data: { examVersion: 'future-bank-version', statementEn: 'Updated bank after completion' } });
    const result = await request('/exams/history', 'GET', undefined, generateToken(owner));
    expect(result.status).toBe(200);
    expect(result.body.data).toHaveLength(1);
    expect(result.body.data[0]).toMatchObject({ examId: source.examId, examVersion: recorded.examVersion, language: 'es', percentage: 100 });
    expect(result.body.data[0].examVersion).not.toBe('future-bank-version');
  });
  it('never includes another account attempts or configured attempts in history', async () => {
    const a = await prisma.user.create({ data: { email: 'history-a@example.test', username: 'history-a', passwordHash: 'unused' } });
    const b = await prisma.user.create({ data: { email: 'history-b@example.test', username: 'history-b', passwordHash: 'unused' } });
    for (const user of [a, b]) {
      const source = await engine.createExam(config(), user.id);
      await engine.startExam(source.examId);
      await engine.completeExam(source.examId);
    }
    await engine.createExam(config(), a.id);
    expect((await request('/exams/history')).status).toBe(401);
    const result = await request('/exams/history', 'GET', undefined, generateToken(a));
    expect(result.body.data).toHaveLength(1);
    expect((await prisma.exam.findUniqueOrThrow({ where: { id: result.body.data[0].examId } })).userId).toBe(a.id);
    expect(result.body.data[0].examVersion).toBe('200-301-v1.1');
  });
});

describe('Independent topic changes in study mode', () => {
  it('selects only the chosen topic and preserves the source answers, filters and deadlines', async () => {
    const source = await attempt({ questionCount: 2, studyMode: true, strictMode: false, perQuestionTimeLimit: 30, language: 'es', showExplanations: false, soundEnabled: false });
    await engine.submitAnswer(source.id, source.question.examQuestionId, [question.options[0].id]);
    const target = await prisma.topic.create({ data: { code: '2.0', nameEn: 'Switching', nameEs: 'Conmutación', examArea: 'network_access', examAreaNumber: '2.0', weightPercentage: 20 } });
    await prisma.question.update({ where: { id: other.id }, data: { primaryTopicId: target.id } });
    const before = await prisma.exam.findUniqueOrThrow({ where: { id: source.id }, include: { questions: { include: { responses: true } } } });
    const fresh = await engine.createStudyTopicPractice(source.id, target.id, 1);
    expect(fresh.config).toMatchObject({ mode: 'topic_practice', topics: [target.id], language: 'es', difficulty: 'mixed', studyMode: true, strictMode: false, showExplanations: false, soundEnabled: false, perQuestionTimeLimit: 30, practiceSourceExamId: source.id });
    await engine.startExam(fresh.examId);
    expect((await engine.getCurrentQuestion(fresh.examId)).id).toBe(other.id);
    expect(await prisma.exam.findUniqueOrThrow({ where: { id: source.id }, include: { questions: { include: { responses: true } } } })).toEqual(before);
  });
  it('rejects empty topics, missing topics and invalid counts without unrelated fallback', async () => {
    const source = await attempt({ studyMode: true, strictMode: false, untimed: true });
    const empty = await prisma.topic.create({ data: { code: '6.0', nameEn: 'Empty', nameEs: 'Vacío', examArea: 'automation_programmability', examAreaNumber: '6.0', weightPercentage: 10 } });
    await expect(engine.createStudyTopicPractice(source.id, empty.id, 1)).rejects.toThrow('Only 0');
    await expect(engine.createStudyTopicPractice(source.id, 'missing-topic', 1)).rejects.toThrow('Topic not found');
    for (const count of [0, 201, 1.5]) await expect(engine.createStudyTopicPractice(source.id, question.primaryTopicId, count)).rejects.toThrow('1 to 200');
    expect(await prisma.exam.count()).toBe(1);
  });
  it('rejects strict and configured attempts but supports completed studies', async () => {
    const strict = await attempt();
    await expect(engine.createStudyTopicPractice(strict.id, question.primaryTopicId, 1)).rejects.toThrow('study attempt');
    const configured = await engine.createExam(config({ studyMode: true, strictMode: false }));
    await expect(engine.createStudyTopicPractice(configured.examId, question.primaryTopicId, 1)).rejects.toThrow('study attempt');
    const source = await attempt({ studyMode: true, strictMode: false, untimed: true });
    await engine.submitAnswer(source.id, source.question.examQuestionId, [question.options[0].id]);
    const fresh = await engine.createStudyTopicPractice(source.id, question.primaryTopicId, 1);
    expect(fresh.config.untimed).toBe(true);
    expect(fresh.config.perQuestionTimeLimit).toBeUndefined();
  });
  it('preserves account ownership and prevents administrators creating practices in another account', async () => {
    const owner = await prisma.user.create({ data: { email: 'topic-owner@example.test', username: 'topic-owner', passwordHash: 'unused' } });
    const admin = await prisma.user.create({ data: { email: 'topic-admin@example.test', username: 'topic-admin', role: 'admin', passwordHash: 'unused' } });
    const source = await engine.createExam(config({ studyMode: true, strictMode: false }), owner.id);
    await engine.startExam(source.examId);
    const body = { topicId: question.primaryTopicId, questionCount: 1 };
    expect((await request(`/exams/${source.examId}/change-study-topic`, 'POST', body)).status).toBe(403);
    expect((await request(`/exams/${source.examId}/change-study-topic`, 'POST', body, generateToken(admin))).status).toBe(403);
    const fresh = await request(`/exams/${source.examId}/change-study-topic`, 'POST', body, generateToken(owner));
    expect(fresh.status).toBe(201);
    expect((await prisma.exam.findUniqueOrThrow({ where: { id: fresh.body.data.examId } })).userId).toBe(owner.id);
    expect((await request(`/exams/${source.examId}/change-study-topic`, 'POST', { ...body, questionCount: 0 }, generateToken(owner))).status).toBe(400);
  });
});

describe('Partial editorial updates after validator upgrade', () => {
  it('preserves omitted metadata while invalidating the previous approval', async () => {
    const admin = await prisma.user.create({ data: { email: 'patch-validator@example.test', username: 'patch-validator', passwordHash: 'unused', role: 'admin' } });
    await prisma.question.update({ where: { id: question.id }, data: { estimatedTimeSeconds: 180, subtopics: JSON.stringify(['preserved-topic']) } });
    const response = await request('/questions/' + question.id, 'PUT', { explanationEn: 'Revised explanation only; metadata is unchanged.' }, generateToken(admin));
    expect(response.status).toBe(200);
    const current = await prisma.question.findUniqueOrThrow({ where: { id: question.id } });
    expect(current.estimatedTimeSeconds).toBe(180);
    expect(JSON.parse(current.subtopics!)).toEqual(['preserved-topic']);
    expect(current.validationStatus).toBe('pending_review');
    expect(current.statementEs).toBe(question.statementEs);
  });
});

describe('Applying assisted technical bank decisions', () => {
  async function reviewTopics() {
    const areas = ['network_fundamentals', 'network_access', 'ip_connectivity', 'ip_services', 'security_fundamentals', 'automation_programmability'];
    for (const [i, area] of areas.entries()) await prisma.topic.upsert({ where: { code: `${i + 1}.0` }, update: {}, create: { code: `${i + 1}.0`, nameEn: area, nameEs: area, examArea: area, examAreaNumber: `${i + 1}.0`, weightPercentage: 10 } });
  }
  it('upgrades the published 366 approvals, audits rejections and preserves the corrected originals', async () => {
    const { syncReviewedBank, REVIEW_SERVICE_ID } = await import('../prisma/sync-reviewed-bank');
    const { digest, contentRecord } = await import('../prisma/bank-review-format');
    const { resolve } = await import('node:path');
    const prior = mkdtempSync(join(tmpdir(), 'ccna-second-review-'));
    try {
      const source = resolve(__dirname, '../prisma/questions');
      for (const file of readdirSync(source).filter(name => name.endsWith('.json') && !['reviewed_legacy_corrections_20261029.json', 'reviewed_routing_corrections_20261029.json', 'reviewed_batch3_corrections_20261029.json'].includes(name))) writeFileSync(join(prior, file), readFileSync(join(source, file)));
      const manifest = JSON.parse(readFileSync(resolve(__dirname, '../prisma/reviews/assisted-20261029.json'), 'utf8'));
      manifest.records = manifest.records.filter((row: any) => !['reviewed_legacy_corrections_20261029.json', 'reviewed_routing_corrections_20261029.json', 'reviewed_batch3_corrections_20261029.json'].includes(row.file));
      for (const row of manifest.records) if (['assisted-legacy-review-20261029-v1', 'assisted-routing-review-20261029-v1', 'assisted-batch3-review-20261029-v1'].includes(row.reviewRound)) row.decision = 'pending_review';
      manifest.summary = { validated: 366, pending_review: 298 };
      const manifestPath = join(prior, 'previous-manifest.snapshot');
      writeFileSync(manifestPath, JSON.stringify(manifest));
      await reviewTopics();
      expect((await syncReviewedBank(prisma, true, prior, manifestPath)).appliedApprovals).toBe(366);
      const id = 'ccna-legacy-batch1_network_fundamentals-001';
      const before = await prisma.question.findUniqueOrThrow({ where: { id }, include: { options: true, primaryTopic: true } });
      const result = await syncReviewedBank(prisma, true);
      expect(result.questionsToCreate).toBe(74);
      expect(result.appliedApprovals).toBe(106);
      expect(result.appliedRejections).toBe(78);
      expect(result.approvalsAlreadyPresent).toBe(366);
      const after = await prisma.question.findUniqueOrThrow({ where: { id }, include: { options: true, primaryTopic: true } });
      expect(digest(contentRecord(after))).toBe(digest(contentRecord(before)));
      expect(after.validationStatus).toBe('rejected');
      expect((await prisma.question.findUniqueOrThrow({ where: { id: id + '-review-r1' } })).validationStatus).toBe('validated');
      expect(await prisma.questionReview.count({ where: { reviewerId: REVIEW_SERVICE_ID, status: 'validated' } })).toBe(472);
      expect(await prisma.questionReview.count({ where: { reviewerId: REVIEW_SERVICE_ID, status: 'rejected' } })).toBe(78);
      const again = await syncReviewedBank(prisma, true);
      expect(again.appliedApprovals).toBe(0);
      expect(again.appliedRejections).toBe(0);
      expect(again.rejectionsAlreadyPresent).toBe(78);
    } finally { rmSync(prior, { recursive: true, force: true }); }
  }, 60000);
  it('upgrades the published 420 approvals including later documented corrections', async () => {
    const { syncReviewedBank, REVIEW_SERVICE_ID } = await import('../prisma/sync-reviewed-bank');
    const { digest, contentRecord } = await import('../prisma/bank-review-format');
    const source = join(__dirname, '../prisma/questions');
    const prior = mkdtempSync(join(tmpdir(), 'ccna-routing-review-'));
    try {
      for (const file of readdirSync(source).filter(name => name.endsWith('.json') && !['reviewed_routing_corrections_20261029.json', 'reviewed_batch3_corrections_20261029.json'].includes(name))) writeFileSync(join(prior, file), readFileSync(join(source, file)));
      const manifest = JSON.parse(readFileSync(join(__dirname, '../prisma/reviews/assisted-20261029.json'), 'utf8'));
      manifest.records = manifest.records.filter((row: any) => !['reviewed_routing_corrections_20261029.json', 'reviewed_batch3_corrections_20261029.json'].includes(row.file));
      for (const row of manifest.records) if (['assisted-routing-review-20261029-v1', 'assisted-batch3-review-20261029-v1'].includes(row.reviewRound)) row.decision = 'pending_review';
      manifest.summary = { validated: 420, pending_review: 240, rejected: 38 };
      const manifestPath = join(prior, 'previous-manifest.snapshot');
      writeFileSync(manifestPath, JSON.stringify(manifest));
      await reviewTopics();
      expect((await syncReviewedBank(prisma, true, prior, manifestPath)).appliedApprovals).toBe(420);
      const id = 'ccna-legacy-batch2_ip_connectivity-001';
      const before = await prisma.question.findUniqueOrThrow({ where: { id }, include: { options: true, primaryTopic: true } });
      const result = await syncReviewedBank(prisma, true);
      expect(result.questionsToCreate).toBe(40);
      expect(result.appliedApprovals).toBe(52);
      expect(result.appliedRejections).toBe(40);
      expect(result.approvalsAlreadyPresent).toBe(420);
      expect(result.rejectionsAlreadyPresent).toBe(38);
      const after = await prisma.question.findUniqueOrThrow({ where: { id }, include: { options: true, primaryTopic: true } });
      expect(digest(contentRecord(after))).toBe(digest(contentRecord(before)));
      expect(after.validationStatus).toBe('rejected');
      expect((await prisma.question.findUniqueOrThrow({ where: { id: id + '-review-r1' } })).validationStatus).toBe('validated');
      expect(await prisma.questionReview.count({ where: { reviewerId: REVIEW_SERVICE_ID } })).toBe(550);
      const again = await syncReviewedBank(prisma, true);
      expect(again.appliedApprovals + again.appliedRejections + again.questionsToCreate).toBe(0);
    } finally { rmSync(prior, { recursive: true, force: true }); }
  }, 60000);
  it('upgrades the published 426 approvals without importing drafts or changing held questions', async () => {
    const { syncReviewedBank, REVIEW_SERVICE_ID } = await import('../prisma/sync-reviewed-bank');
    const { digest, contentRecord } = await import('../prisma/bank-review-format');
    const source = join(__dirname, '../prisma/questions');
    const prior = mkdtempSync(join(tmpdir(), 'ccna-third-batch-review-'));
    try {
      for (const file of readdirSync(source).filter(name => name.endsWith('.json') && name !== 'reviewed_batch3_corrections_20261029.json')) writeFileSync(join(prior, file), readFileSync(join(source, file)));
      const manifest = JSON.parse(readFileSync(join(__dirname, '../prisma/reviews/assisted-20261029.json'), 'utf8'));
      manifest.records = manifest.records.filter((row: any) => row.file !== 'reviewed_batch3_corrections_20261029.json');
      for (const row of manifest.records) if (row.reviewRound === 'assisted-batch3-review-20261029-v1') row.decision = 'pending_review';
      manifest.summary = { validated: 426, pending_review: 234, rejected: 41 };
      const manifestPath = join(prior, 'previous-manifest.snapshot');
      writeFileSync(manifestPath, JSON.stringify(manifest));
      await reviewTopics();
      expect((await syncReviewedBank(prisma, true, prior, manifestPath)).appliedApprovals).toBe(426);
      const id = 'ccna-legacy-batch3_all-008';
      const before = await prisma.question.findUniqueOrThrow({ where: { id }, include: { options: true, primaryTopic: true } });
      const result = await syncReviewedBank(prisma, true);
      expect(result.questionsToCreate).toBe(37);
      expect(result.appliedApprovals).toBe(46);
      expect(result.appliedRejections).toBe(37);
      expect(result.approvalsAlreadyPresent).toBe(426);
      expect(result.rejectionsAlreadyPresent).toBe(41);
      const after = await prisma.question.findUniqueOrThrow({ where: { id }, include: { options: true, primaryTopic: true } });
      expect(digest(contentRecord(after))).toBe(digest(contentRecord(before)));
      expect(after.validationStatus).toBe('rejected');
      expect((await prisma.question.findUniqueOrThrow({ where: { id: id + '-review-r1' } })).validationStatus).toBe('validated');
      for (const number of ['019', '030']) {
        expect((await prisma.question.findUniqueOrThrow({ where: { id: 'ccna-legacy-batch3_all-' + number } })).validationStatus).toBe('pending_review');
        expect(await prisma.question.findUnique({ where: { id: 'ccna-legacy-batch3_all-' + number + '-review-r1' } })).toBeNull();
      }
      expect(await prisma.questionReview.count({ where: { reviewerId: REVIEW_SERVICE_ID } })).toBe(550);
      const again = await syncReviewedBank(prisma, true);
      expect(again.appliedApprovals + again.appliedRejections + again.questionsToCreate).toBe(0);
    } finally { rmSync(prior, { recursive: true, force: true }); }
  }, 60000);
  it('upgrades the previously applied 131 decisions and preserves original questions alongside corrected versions', async () => {
    const { syncReviewedBank, REVIEW_SERVICE_ID } = await import('../prisma/sync-reviewed-bank');
    const { digest, contentRecord } = await import('../prisma/bank-review-format');
    const { resolve } = await import('node:path');
    const prior = mkdtempSync(join(tmpdir(), 'ccna-prior-review-'));
    try {
      const source = resolve(__dirname, '../prisma/questions');
      for (const file of readdirSync(source).filter(name => name.endsWith('.json') && !name.startsWith('reviewed_'))) writeFileSync(join(prior, file), readFileSync(join(source, file)));
      const manifest = JSON.parse(readFileSync(resolve(__dirname, '../prisma/reviews/assisted-20261029.json'), 'utf8'));
      manifest.records = manifest.records.filter((row: any) => !row.supersedesQuestionId);
      for (const row of manifest.records) if (row.reviewRound) row.decision = 'pending_review';
      manifest.summary = { validated: 131, pending_review: 529 };
      const manifestPath = join(prior, 'previous-manifest.snapshot');
      writeFileSync(manifestPath, JSON.stringify(manifest));
      await reviewTopics();
      expect((await syncReviewedBank(prisma, true, prior, manifestPath)).appliedApprovals).toBe(131);
      const originalId = 'ccna-original-20261024-b03-026';
      const originalBefore = await prisma.question.findUniqueOrThrow({ where: { id: originalId }, include: { options: true, primaryTopic: true } });
      const result = await syncReviewedBank(prisma, true);
      expect(result.questionsToCreate).toBe(78);
      expect(result.appliedApprovals).toBe(341);
      expect(result.approvalsAlreadyPresent).toBe(131);
      expect(await prisma.questionReview.count({ where: { reviewerId: REVIEW_SERVICE_ID } })).toBe(550);
      const originalAfter = await prisma.question.findUniqueOrThrow({ where: { id: originalId }, include: { options: true, primaryTopic: true } });
      expect(digest(contentRecord(originalAfter))).toBe(digest(contentRecord(originalBefore)));
      expect(originalAfter.validationStatus).toBe('rejected');
      const corrected = await prisma.question.findUniqueOrThrow({ where: { id: originalId + '-review-r1' } });
      expect(corrected.validationStatus).toBe('validated');
      expect(corrected.questionFamilyId).toBe(originalAfter.questionFamilyId);
      expect(corrected.statementEn).toContain('up and enabled in the same OSPF process');
    } finally { rmSync(prior, { recursive: true, force: true }); }
  }, 60000);
  it('is opt-in, idempotent, audited and makes only reviewed families eligible for a 100-question exam', async () => {
    const { syncReviewedBank, REVIEW_SERVICE_ID, readReviewedBank } = await import('../prisma/sync-reviewed-bank');
    await reviewTopics();
    const preview = await syncReviewedBank(prisma);
    expect(preview.mode).toBe('dry-run');
    expect(preview.questionsToCreate).toBe(738);
    expect(await prisma.question.count()).toBe(5);
    expect(await prisma.user.findUnique({ where: { id: REVIEW_SERVICE_ID } })).toBeNull();
    const applied = await syncReviewedBank(prisma, true);
    expect(applied.appliedApprovals).toBe(472);
    expect(applied.appliedRejections).toBe(78);
    expect(await prisma.question.count()).toBe(743);
    const pending = readReviewedBank().candidates.filter(item => item.row.decision === 'pending_review').map(item => item.row.id);
    expect(await prisma.question.count({ where: { id: { in: pending }, validationStatus: 'pending_review' } })).toBe(188);
    expect(await prisma.questionReview.count({ where: { reviewerId: REVIEW_SERVICE_ID } })).toBe(550);
    const again = await syncReviewedBank(prisma, true);
    expect(again.appliedApprovals).toBe(0);
    expect(again.approvalsAlreadyPresent).toBe(472);
    expect(await prisma.questionReview.count({ where: { reviewerId: REVIEW_SERVICE_ID } })).toBe(550);
    const exam = await engine.createExam(config({ questionCount: 100, mode: 'full_simulation' }));
    const selected = await prisma.examQuestion.findMany({ where: { examId: exam.examId }, include: { question: true } });
    expect(selected).toHaveLength(100);
    expect(selected.every(item => item.question.validationStatus === 'validated' && item.contentSnapshot)).toBe(true);
    expect(new Set(selected.map(item => item.question.questionFamilyId || item.questionId)).size).toBe(100);
    const service = await prisma.user.findUniqueOrThrow({ where: { id: REVIEW_SERVICE_ID } });
    expect((await request('/users/login', 'POST', { email: service.email, password: 'any-password' })).status).toBe(401);
    expect((await request('/users/me', 'GET', undefined, generateToken(service))).status).toBe(401);
  }, 60000);
  it('never overwrites a local edit and rolls back the complete batch', async () => {
    const { syncReviewedBank } = await import('../prisma/sync-reviewed-bank');
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    await reviewTopics();
    await loadOriginalBatch(resolve(__dirname, '../prisma/questions/original_20261024_50.json'), prisma);
    await prisma.question.update({ where: { id: 'ccna-original-20261024-001' }, data: { explanationEs: 'Edición local que debe conservarse sin sobrescritura.' } });
    await expect(syncReviewedBank(prisma, true)).rejects.toThrow('existing content differs');
    expect(await prisma.question.count()).toBe(55);
    expect(await prisma.questionReview.count()).toBe(0);
    expect((await prisma.question.findUniqueOrThrow({ where: { id: 'ccna-original-20261024-001' } })).explanationEs).toContain('Edición local');
  }, 30000);
  it('does not silently restore an approval withdrawn after a previous import', async () => {
    const { syncReviewedBank } = await import('../prisma/sync-reviewed-bank');
    await reviewTopics();
    await syncReviewedBank(prisma, true);
    await prisma.question.update({ where: { id: 'ccna-original-20261024-001' }, data: { validationStatus: 'pending_review' } });
    await expect(syncReviewedBank(prisma, true)).rejects.toThrow('status changed after review');
    expect((await prisma.question.findUniqueOrThrow({ where: { id: 'ccna-original-20261024-001' } })).validationStatus).toBe('pending_review');
    expect(await prisma.questionReview.count()).toBe(550);
  }, 60000);
  it('does not overwrite an existing approval to reject a superseded candidate', async () => {
    const { syncReviewedBank } = await import('../prisma/sync-reviewed-bank');
    const { loadOriginalBatch } = await import('../prisma/load-original-batch');
    const { resolve } = await import('node:path');
    await reviewTopics();
    await loadOriginalBatch(resolve(__dirname, '../prisma/questions/original_20261024_b03_50.json'), prisma);
    const id = 'ccna-original-20261024-b03-026';
    await prisma.question.update({ where: { id }, data: { validationStatus: 'validated' } });
    await expect(syncReviewedBank(prisma, true)).rejects.toThrow('existing approval cannot be withdrawn');
    expect(await prisma.questionReview.count()).toBe(0);
    expect(await prisma.question.count()).toBe(55);
    expect((await prisma.question.findUniqueOrThrow({ where: { id } })).validationStatus).toBe('validated');
  }, 30000);
  it('does not replay a rejection after an editor restores the original to pending', async () => {
    const { syncReviewedBank } = await import('../prisma/sync-reviewed-bank');
    await reviewTopics();
    await syncReviewedBank(prisma, true);
    const id = 'ccna-legacy-batch1_network_fundamentals-001';
    await prisma.question.update({ where: { id }, data: { validationStatus: 'pending_review' } });
    await expect(syncReviewedBank(prisma, true)).rejects.toThrow('status changed after review');
    expect((await prisma.question.findUniqueOrThrow({ where: { id } })).validationStatus).toBe('pending_review');
  }, 60000);
});
