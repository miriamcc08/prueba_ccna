const { test, expect } = require('@playwright/test');

test('the actual API client registers, restores login, recovers an exam and preserves private favorites', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const name = 'browser' + Date.now();
    const registered = await api.register(name + '@example.test', name, 'browser-test-password');
    if (!registered.success) return { registered };
    api.setToken(registered.data.token);
    const profile = await api.getCurrentUser();
    const login = await api.login(name + '@example.test', 'browser-test-password');
    const exam = await api.createExam({ questionCount: 2, language: 'es', mode: 'custom', studyMode: true, strictMode: false, untimed: true, randomize: false });
    if (!exam.success) return { registered: registered.success, exam };
    const id = exam.data.examId;
    const started = await api.startExam(id);
    const q = await api.getExamQuestion(id, 0);
    const favorite = await api.setFavorite(q.data.id, true);
    const favorites = await api.getFavorites();
    const answer = await api.submitExamAnswer(id, { examQuestionId: q.data.examQuestionId, selectedOptionIds: q.data.options.slice(0, q.data.multipleAnswerCount || 1).map(o => o.id) });
    const recovered = await api.getExamState(id);
    const prior = await api.getExamQuestion(id, 0);
    const bank = await api.getQuestions({ favoritesOnly: true, language: 'es' });
    const stats = await api.getAdminStats();
    return {
      registered: registered.success, profile: profile.success, login: login.success,
      started: started.success, expiresAt: started.data.expiresAt, favorite: favorite.success,
      favorites: favorites.data.includes(q.data.id), answer: answer.success,
      recovered: recovered.data.currentQuestionIndex, prior: prior.data.feedback?.confirmed,
      filtered: bank.data.length, stats: stats.success, id,
    };
  });
  expect(result).toMatchObject({ registered: true, profile: true, login: true, started: true, expiresAt: null, favorite: true, favorites: true, answer: true, recovered: 1, prior: true, filtered: 1, stats: true });
  await page.goto('/exam/' + result.id);
  await expect(page.locator('button').filter({ hasText: /Confirmar|Confirm/ }).first()).toBeVisible();
  await page.reload();
  await expect(page.locator('button').filter({ hasText: /Confirmar|Confirm/ }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pregunta anterior' })).toBeEnabled();
  await page.getByRole('button', { name: 'Pregunta anterior' }).click();
  await expect(page.getByRole('button', { name: /Siguiente Pregunta|Siguiente pregunta|Next Question/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Quitar favorita' })).toBeVisible();
  await page.getByRole('button', { name: 'Quitar favorita' }).click();
  await expect(page.getByRole('button', { name: 'Guardar favorita' })).toBeVisible();
  await page.screenshot({ path: '/tmp/ccna-study-browser.png', fullPage: true });
  await page.getByRole('button', { name: 'Siguiente Pregunta' }).click();
  const count = await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    const q = await api.getExamQuestion(id, 1);
    return q.data.multipleAnswerCount || 1;
  }, result.id);
  for (let i = 0; i < count; i++) await page.locator('button.w-full.text-left').nth(i).click();
  await page.getByRole('button', { name: 'Confirmar y Continuar' }).click();
  await expect(page.getByRole('button', { name: 'Finalizar Examen', exact: true })).toHaveCount(2);
  await page.getByRole('button', { name: 'Finalizar Examen' }).last().click();
  await expect(page).toHaveURL(/\/results\//);
  const difficulty = await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getExamResults(id)).data.difficultyBreakdown;
  }, result.id);
  const difficultyTable = page.getByRole('table', { name: 'Rendimiento por dificultad' });
  await expect(difficultyTable).toBeVisible();
  await expect(difficultyTable.getByRole('row')).toHaveCount(difficulty.length + 1);
  for (const [index, item] of difficulty.entries()) {
    const cells = difficultyTable.getByRole('row').nth(index + 1).getByRole('cell');
    await expect(cells.nth(0)).toHaveText(String(item.total));
    await expect(cells.nth(1)).toHaveText(String(item.correct));
    await expect(cells.nth(2)).toHaveText(String(item.total - item.correct));
    await expect(cells.nth(3)).toHaveText(item.percentage + '%');
  }


});

test('registration and sign-in forms use the real authentication endpoints', async ({ page }) => {
  await page.goto('/register');
  const name = 'form' + Date.now();
  const inputs = page.locator('form input');
  await inputs.nth(0).fill(name);
  await inputs.nth(1).fill(name + '@example.test');
  await inputs.nth(2).fill('browser-form-password');
  if (await inputs.count() > 3) await inputs.nth(3).fill('browser-form-password');
  await page.locator('form button[type=submit]').click();
  await expect(page).not.toHaveURL(/\/register/);
  await page.reload();
  await expect(page).not.toHaveURL(/\/login/);
  await page.evaluate(() => localStorage.clear());
  await page.goto('/login');
  await page.locator('form input[type=email]').fill(name + '@example.test');
  await page.locator('form input[type=password]').fill('browser-form-password');
  await page.locator('form button[type=submit]').click();
  await expect(page).not.toHaveURL(/\/login/);
});

test('an administrator reviews an imported candidate with evidence and sees real statistics', async ({ page }) => {
  await page.goto('/');
  const account = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const name = 'reviewer' + Date.now();
    const res = await api.register(name + '@example.test', name, 'browser-review-password');
    return { id: res.data.user.id, email: name + '@example.test' };
  });
  const { PrismaClient } = require('../../server/node_modules/@prisma/client');
  const db = new PrismaClient({ datasourceUrl: process.env.CCNA_BROWSER_DATABASE_URL });
  await db.user.update({ where: { id: account.id }, data: { role: 'admin' } });
  await db.$disconnect();
  const imported = await page.evaluate(async email => {
    const { default: api } = await import('/src/services/api.ts');
    const login = await api.login(email, 'browser-review-password');
    api.setToken(login.data.token);
    localStorage.setItem('ccna_user', JSON.stringify(login.data.user));
    return api.importQuestions([{
      statementEn: 'Browser review fixture: how many bits does an IPv4 address contain?',
      statementEs: 'Pregunta de prueba: ¿cuántos bits contiene una dirección IPv4?',
      questionType: 'single_choice', difficulty: 'basic', primaryTopicExamArea: 'network_fundamentals',
      explanationEn: 'IPv4 uses 32-bit addresses.', explanationEs: 'IPv4 utiliza direcciones de 32 bits.',
      options: [
        { optionLabel: 'A', optionTextEn: '32 bits', optionTextEs: '32 bits', isCorrect: true },
        { optionLabel: 'B', optionTextEn: '128 bits', optionTextEs: '128 bits', isCorrect: false },
      ],
    }]);
  }, account.email);
  expect(imported.data.imported).toBe(1);
  await page.goto('/admin');
  const row = page.getByRole('row').filter({ hasText: /Pregunta de prueba: ¿cuántos bits/ });
  await expect(row).toContainText('pending_review');
  await row.getByTitle('Approve / Validate').click();
  await page.getByLabel('Notas de revisión (mínimo 20 caracteres)').fill('Fixture de prueba: concepto, distractores y traducción revisados.');
  await page.getByLabel('Referencia técnica HTTPS').fill('https://www.rfc-editor.org/rfc/rfc791');
  await page.getByRole('checkbox', { name: /He comprobado/ }).check();
  await page.getByRole('button', { name: 'Guardar revisión' }).click();
  await expect(row).toContainText('validated');
  const stats = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getAdminStats()).data;
  });
  expect(stats.totalQuestions).toBe(9);
  expect(stats.validatedQuestions).toBe(9);
  await row.getByTitle('Approve / Validate').click();
  await page.getByText('Editar como nueva revisión', { exact: true }).click();
  await page.getByLabel('Enunciado EN de la revisión').fill('Revised IPv4 address-length question for browser tests');
  await page.getByLabel('Enunciado ES de la revisión').fill('Pregunta IPv4 revisada para pruebas del navegador');
  await page.getByRole('button', { name: 'Guardar como nueva revisión' }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Pregunta IPv4 revisada para pruebas del navegador' })).toContainText('pending_review');
  await expect(row).toContainText('pending_review');

});

test('strict mode recovers the same deadline and saved cursor after a disconnected submission', async ({ page, context }) => {
  await page.goto('/');
  const session = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const exam = await api.createExam({ questionCount: 2, language: 'es', mode: 'custom', strictMode: true, randomize: false });
    const id = exam.data.examId;
    const state = await api.startExam(id);
    const q = await api.getExamQuestion(id, 0);
    return { id, deadline: state.data.expiresAt, questionId: q.data.examQuestionId, optionIds: q.data.options.slice(0, q.data.multipleAnswerCount || 1).map(o => o.id) };
  });
  await page.goto('/exam/' + session.id);
  await expect(page.getByRole('button', { name: 'Confirmar y Continuar' })).toBeVisible();
  await context.setOffline(true);
  const disconnected = await page.evaluate(async session => {
    const { default: api } = await import('/src/services/api.ts');
    return api.submitExamAnswer(session.id, { examQuestionId: session.questionId, selectedOptionIds: session.optionIds });
  }, session);
  expect(disconnected.success).toBe(false);
  await context.setOffline(false);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Confirmar y Continuar' })).toBeVisible();
  const recovered = await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getExamState(id)).data;
  }, session.id);
  expect(recovered.expiresAt).toBe(session.deadline);
  expect(recovered.currentQuestionIndex).toBe(0);
  expect(recovered.answeredCount).toBe(0);
});

test('failed completion stays in the exam and can be retried without losing progress', async ({ page }) => {
  await page.goto('/');
  const id = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const exam = await api.createExam({ questionCount: 2, language: 'es', mode: 'custom', strictMode: true, randomize: false });
    await api.startExam(exam.data.examId);
    return exam.data.examId;
  });
  await page.goto('/exam/' + id);
  await expect(page.getByRole('button', { name: 'Confirmar y Continuar' })).toBeVisible();
  const completion = '**/exams/' + id + '/complete';
  await page.route(completion, route => route.abort('internetdisconnected'));
  await page.getByRole('button', { name: 'Finalizar Examen', exact: true }).click();
  await page.getByRole('button', { name: 'Sí, Entregar Examen' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page).toHaveURL(new RegExp('/exam/' + id + '$'));
  const state = await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getExamState(id)).data;
  }, id);
  expect(state.status).toBe('in_progress');
  expect(state.answeredCount).toBe(0);
  await page.unroute(completion);
  await page.getByRole('button', { name: 'Finalizar Examen', exact: true }).click();
  await page.getByRole('button', { name: 'Sí, Entregar Examen' }).click();
  await expect(page).toHaveURL(new RegExp('/results/' + id + '$'));
});

test('the five-minute warning appears when the running countdown reaches the threshold', async ({ page }) => {
  await page.goto('/');
  const session = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const exam = await api.createExam({ questionCount: 2, language: 'es', mode: 'custom', strictMode: true, randomize: false });
    const state = await api.startExam(exam.data.examId);
    return { id: exam.data.examId, deadline: state.data.expiresAt };
  });
  // Advance the browser clock only; the server still owns the actual deadline.
  await page.clock.install({ time: new Date(new Date(session.deadline).getTime() - 302000) });
  await page.goto('/exam/' + session.id);
  await expect(page.getByRole('button', { name: 'Confirmar y Continuar' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continuar Examen', exact: true })).toHaveCount(0);
  await page.clock.fastForward(4000);
  await expect(page.getByRole('button', { name: 'Continuar Examen', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar Examen', exact: true }).click();
  await page.clock.fastForward(4000);
  await expect(page.getByRole('button', { name: 'Continuar Examen', exact: true })).toHaveCount(0);
});

for (const showExplanations of [false, true]) {
  test(`study explanation preference ${showExplanations} survives navigation and reload`, async ({ page }) => {
    await page.goto('/');
    const session = await page.evaluate(async showExplanations => {
      const { default: api } = await import('/src/services/api.ts');
      const exam = await api.createExam({ questionCount: 2, language: 'es', mode: 'custom', studyMode: true, strictMode: false, untimed: true, randomize: false, showExplanations });
      await api.startExam(exam.data.examId);
      const q = (await api.getExamQuestion(exam.data.examId, 0)).data;
      return { id: exam.data.examId, choices: q.multipleAnswerCount || 1 };
    }, showExplanations);
    await page.goto('/exam/' + session.id);
    await expect(page.getByRole('button', { name: 'Confirmar y Continuar' })).toBeVisible();
    for (let i = 0; i < session.choices; i++) await page.locator('button.w-full.text-left').nth(i).click();
    await page.getByRole('button', { name: 'Confirmar y Continuar' }).click();
    await expect(page.getByRole('button', { name: 'Siguiente Pregunta' })).toBeVisible();
    const explanation = page.getByText('Explicación Técnica:', { exact: true });
    await expect(explanation).toHaveCount(showExplanations ? 1 : 0);
    await page.reload();
    await page.getByRole('button', { name: 'Pregunta anterior' }).click();
    await expect(page.getByRole('button', { name: 'Siguiente Pregunta' })).toBeVisible();
    await expect(explanation).toHaveCount(showExplanations ? 1 : 0);
    const feedback = await page.evaluate(async id => {
      const { default: api } = await import('/src/services/api.ts');
      return (await api.getExamQuestion(id, 0)).data.feedback;
    }, session.id);
    expect(typeof feedback.explanation === 'string').toBe(showExplanations);
  });
}

test('administrator authors a bilingual pending candidate and can search across multiple pages', async ({ page }) => {
  await page.goto('/');
  const account = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const name = 'author' + Date.now();
    const result = await api.register(name + '@example.test', name, 'browser-author-password');
    return { id: result.data.user.id, email: name + '@example.test' };
  });
  const { PrismaClient } = require('../../server/node_modules/@prisma/client');
  const db = new PrismaClient({ datasourceUrl: process.env.CCNA_BROWSER_DATABASE_URL });
  await db.user.update({ where: { id: account.id }, data: { role: 'admin' } });
  const topic = await db.topic.findFirstOrThrow();
  await page.evaluate(async email => {
    const { default: api } = await import('/src/services/api.ts');
    const result = await api.login(email, 'browser-author-password');
    api.setToken(result.data.token);
    localStorage.setItem('ccna_user', JSON.stringify(result.data.user));
  }, account.email);
  await page.goto('/admin');
  await page.getByRole('button', { name: 'Crear pregunta', exact: true }).click();
  await page.getByLabel('Enunciado EN', { exact: true }).fill('Browser authored fixture: how many bits are in IPv4?');
  await page.getByLabel('Enunciado ES', { exact: true }).fill('Creada desde navegador: ¿cuántos bits tiene IPv4?');
  for (const [i, label] of ['A', 'B', 'C', 'D'].entries()) {
    for (const language of ['EN', 'ES']) await page.getByLabel(`Opción ${label} — ${language}`, { exact: true }).fill(['32 bits', '128 bits', '64 bits', '16 bits'][i]);
  }
  await page.getByLabel('Correcta A', { exact: true }).check();
  await page.getByLabel('Explicación EN', { exact: true }).fill('IPv4 contains 32 bits according to RFC 791.');
  await page.getByLabel('Explicación ES', { exact: true }).fill('IPv4 contiene 32 bits según el RFC 791.');
  await page.getByLabel('Referencia técnica HTTPS', { exact: true }).fill('https://www.rfc-editor.org/rfc/rfc791');
  await page.getByLabel('Autoría o licencia', { exact: true }).fill('Fixture original de prueba');
  await page.getByRole('button', { name: 'Guardar pendiente de revisión', exact: true }).click();
  const row = page.getByRole('row').filter({ hasText: 'Creada desde navegador:' });
  await expect(row).toContainText('pending_review');
  const saved = await db.question.findFirstOrThrow({ where: { statementEn: { startsWith: 'Browser authored fixture' } }, include: { options: { orderBy: { displayOrder: 'asc' } } } });
  expect(saved.options.map(o => o.displayOrder)).toEqual([0, 1, 2, 3]);
  expect(saved.sourceLicense).toBe('Fixture original de prueba');
  for (let i = 0; i < 55; i++) await db.question.create({ data: {
    statementEn: `Pagination fixture ${i}`, statementEs: `Prueba paginación ${i}`, questionType: 'single_choice', difficulty: 'basic', primaryTopicId: topic.id, validationStatus: 'pending_review',
  } });
  await db.$disconnect();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Página siguiente', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Página siguiente', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Página anterior', exact: true })).toBeEnabled();
  await page.getByLabel('Buscar preguntas').fill('Creada desde navegador:');
  await expect(row).toContainText('pending_review');
  await expect(page.getByRole('button', { name: 'Página siguiente', exact: true })).toBeDisabled();
});

for (const soundEnabled of [true, false]) {
  test(`strict confirmation uses neutral optional sound: ${soundEnabled}`, async ({ page }) => {
    await page.addInitScript(() => {
      window.__auditTones = [];
      if (!window.AudioContext) return;
      const create = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function () {
        const oscillator = create.call(this), start = oscillator.start.bind(oscillator);
        oscillator.start = (...args) => { window.__auditTones.push(oscillator.frequency.value); return start(...args); };
        return oscillator;
      };
    });
    await page.goto('/');
    const session = await page.evaluate(async soundEnabled => {
      const { default: api } = await import('/src/services/api.ts');
      const exam = await api.createExam({ questionCount: 2, language: 'es', mode: 'custom', strictMode: true, randomize: false, soundEnabled });
      await api.startExam(exam.data.examId);
      const q = await api.getExamQuestion(exam.data.examId, 0);
      return { id: exam.data.examId, count: q.data.multipleAnswerCount || 1 };
    }, soundEnabled);
    await page.goto('/exam/' + session.id);
    for (let i = 0; i < session.count; i++) await page.locator('button.w-full.text-left').nth(i).click();
    await page.getByRole('button', { name: 'Confirmar y Continuar' }).click();
    if (soundEnabled) await expect.poll(() => page.evaluate(() => window.__auditTones)).toEqual([440]);
    else { await expect(page.locator('button.w-full.text-left').first()).toBeVisible(); expect(await page.evaluate(() => window.__auditTones)).toEqual([]); }
  });
}

test('history deletion requires confirmation and clears only the signed-in account', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const name = 'privacy' + Date.now();
    const account = await api.register(name + '@example.test', name, 'browser-privacy-password');
    api.setToken(account.data.token);
    localStorage.setItem('ccna_user', JSON.stringify(account.data.user));
    const exam = await api.createExam({ questionCount: 1, language: 'es', mode: 'custom' });
    await api.startExam(exam.data.examId);
    await api.completeExam(exam.data.examId);
  });
  await page.goto('/history');
  const clear = page.getByRole('button', { name: 'Borrar mi historial', exact: true });
  await expect(clear).toBeEnabled();
  page.once('dialog', dialog => dialog.dismiss());
  await clear.click();
  await expect(clear).toBeEnabled();
  page.once('dialog', dialog => dialog.accept());
  await clear.click();
  await expect(clear).toBeDisabled();
  expect(await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getExamHistory()).data.length;
  })).toBe(0);
});

test('administrator uploads CSV from a spreadsheet and imported questions remain pending', async ({ page }) => {
  await page.goto('/');
  const account = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const name = 'csvadmin' + Date.now();
    const result = await api.register(name + '@example.test', name, 'browser-csv-password');
    return { id: result.data.user.id, email: name + '@example.test' };
  });
  const { PrismaClient } = require('../../server/node_modules/@prisma/client');
  const db = new PrismaClient({ datasourceUrl: process.env.CCNA_BROWSER_DATABASE_URL });
  await db.user.update({ where: { id: account.id }, data: { role: 'admin' } });
  await page.evaluate(async email => {
    const { default: api } = await import('/src/services/api.ts');
    const result = await api.login(email, 'browser-csv-password');
    api.setToken(result.data.token); localStorage.setItem('ccna_user', JSON.stringify(result.data.user));
  }, account.email);
  await page.goto('/admin');
  await page.getByRole('button', { name: /Importar/ }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Descargar plantilla CSV' }).click();
  expect((await downloadEvent).suggestedFilename()).toBe('plantilla-preguntas.csv');
  const headers = ['statementEn', 'statementEs', 'questionType', 'difficulty', 'primaryTopicExamArea', 'explanationEn', 'explanationEs', 'correctAnswers', 'optionAEn', 'optionAEs', 'optionBEn', 'optionBEs', 'sourceUrl', 'sourceLicense'];
  const values = ['CSV browser fixture: how many IPv4 bits?', 'Prueba CSV navegador: ¿cuántos bits tiene IPv4?', 'single_choice', 'basic', 'network_fundamentals', 'IPv4 has 32 bits, per RFC 791.\nSecond explanation line.', 'IPv4 tiene 32 bits según RFC 791.', 'A', '32', '32', '128', '128', 'https://www.rfc-editor.org/rfc/rfc791', 'Original browser test fixture'];
  const csv = '\uFEFF' + headers.join(',') + '\r\n' + values.map(value => '"' + value.replace(/"/g, '""') + '"').join(',') + '\r\n';
  await page.locator('#json-file-input').setInputFiles({ name: 'preguntas.csv', mimeType: 'text/csv', buffer: Buffer.from(csv, 'utf8') });
  await expect(page.getByLabel('Formato de importación')).toHaveValue('csv');
  await expect(page.getByLabel('Contenido de importación')).toHaveValue(/CSV browser fixture/);
  await page.getByRole('button', { name: 'Procesar importación' }).click();
  await expect.poll(() => db.question.count({ where: { statementEn: values[0], validationStatus: 'pending_review' } })).toBe(1);
  const created = await db.question.findFirstOrThrow({ where: { statementEn: values[0] }, include: { options: true } });
  expect(created.explanationEn).toBe(values[5]);
  expect(created.options.find(option => option.optionLabel === 'A').isCorrect).toBe(true);
  const priorCount = await db.question.count();
  await page.getByLabel('Contenido de importación').fill('statementEn,statementEn\nx,y');
  await page.getByRole('button', { name: 'Procesar importación' }).click();
  await expect(page.getByText(/duplicate headers/)).toBeVisible();
  expect(await db.question.count()).toBe(priorCount);
  await db.$disconnect();
});

test('study restart preserves the previous answer and opens a recoverable independent practice', async ({ page }) => {
  await page.goto('/');
  const source = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const result = await api.createExam({ questionCount: 2, language: 'es', mode: 'custom', studyMode: true, strictMode: false, untimed: true, showExplanations: true, randomize: false });
    const id = result.data.examId;
    await api.startExam(id);
    const question = (await api.getExamQuestion(id, 0)).data;
    return { id, count: question.multipleAnswerCount || 1 };
  });
  await page.goto('/exam/' + source.id);
  await expect(page.getByRole('button', { name: 'Reiniciar ejercicio', exact: true })).toHaveCount(0);
  for (let i = 0; i < source.count; i++) await page.locator('button.w-full.text-left').nth(i).click();
  await page.getByRole('button', { name: 'Confirmar y Continuar' }).click();
  const before = await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getExamQuestion(id, 0)).data;
  }, source.id);
  await page.getByRole('button', { name: 'Reiniciar ejercicio', exact: true }).click();
  await expect(page).not.toHaveURL('/exam/' + source.id);
  await expect(page.getByRole('button', { name: 'Confirmar y Continuar' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Volver al intento original' })).toBeVisible();
  const freshId = page.url().split('/exam/')[1];
  const fresh = await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    return { state: (await api.getExamState(id)).data, question: (await api.getExamQuestion(id, 0)).data };
  }, freshId);
  expect(fresh.state.totalQuestions).toBe(1);
  expect(fresh.state.answeredCount).toBe(0);
  expect(fresh.state.expiresAt).toBeNull();
  expect(fresh.question.id).toBe(before.id);
  expect(fresh.question.feedback).toBeUndefined();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Volver al intento original' })).toBeVisible();
  await page.getByRole('button', { name: 'Volver al intento original' }).click();
  await expect(page).toHaveURL('/exam/' + source.id);
  await page.getByRole('button', { name: 'Pregunta anterior' }).click();
  expect(await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getExamQuestion(id, 0)).data;
  }, source.id)).toEqual(before);
  await expect(page.getByRole('button', { name: 'Reiniciar ejercicio', exact: true })).toBeVisible();
  await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    await api.completeExam(id);
  }, source.id);
  await page.goto('/review/' + source.id);
  await page.getByRole('button', { name: 'Reiniciar ejercicio', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Confirmar y Continuar' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Volver al intento original' })).toBeVisible();
});

test('per-question time recovers after disconnection and finishes unanswered questions automatically', async ({ page, context }) => {
  await page.goto('/');
  const source = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const result = await api.createExam({ questionCount: 2, durationMinutes: 10, language: 'es', mode: 'custom', strictMode: true, randomize: false, perQuestionTimeLimit: 10, soundEnabled: false });
    await api.startExam(result.data.examId);
    return (await api.getExamState(result.data.examId)).data;
  });
  await page.goto('/exam/' + source.examId);
  await expect(page.getByRole('group', { name: 'Tiempo de la pregunta activa' })).toBeVisible();
  await page.reload();
  expect(await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getExamState(id)).data.questionExpiresAt;
  }, source.examId)).toBe(source.questionExpiresAt);
  await context.setOffline(true);
  await expect(page.getByRole('alert').first()).toBeVisible({ timeout: 15000 });
  await context.setOffline(false);
  await expect(page.getByText('Pregunta 2 de 2', { exact: true }).first()).toBeVisible({ timeout: 8000 });
  await expect(page).toHaveURL('/results/' + source.examId, { timeout: 16000 });
  const results = await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getExamResults(id)).data;
  }, source.examId);
  expect(results.unansweredCount).toBe(2);
  expect(results.correctCount).toBe(0);
  expect(results.percentage).toBe(0);
});

test('configuration exposes a per-question limit and untimed study clears it', async ({ page }) => {
  await page.goto('/config?mode=custom');
  const limit = page.getByRole('combobox', { name: /^Límite por pregunta/ });
  await limit.selectOption('60');
  await expect(limit).toHaveValue('60');
  await expect(page.getByText('Límite por pregunta: 60 s', { exact: true })).toBeVisible();
  await page.getByRole('checkbox', { name: /Modo Estudio/ }).check();
  await page.getByRole('checkbox', { name: 'Sin cronómetro', exact: true }).check();
  await expect(limit).toHaveValue('0');
  await expect(limit).toBeDisabled();
  await page.getByRole('checkbox', { name: 'Sin cronómetro', exact: true }).uncheck();
  await expect(limit).toBeEnabled();
  await page.getByRole('checkbox', { name: 'Sin cronómetro', exact: true }).check();
  await page.getByRole('checkbox', { name: /Modo Estudio/ }).uncheck();
  await expect(limit).toBeEnabled();
  await limit.selectOption('30');
  await expect(limit).toHaveValue('30');
});

test('confirming an answer resets the visible countdown for the next question', async ({ page }) => {
  await page.goto('/');
  const source = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const result = await api.createExam({ questionCount: 2, durationMinutes: 10, language: 'es', mode: 'custom', strictMode: true, randomize: false, perQuestionTimeLimit: 10, soundEnabled: false });
    await api.startExam(result.data.examId);
    const question = (await api.getExamQuestion(result.data.examId, 0)).data;
    return { id: result.data.examId, count: question.multipleAnswerCount || 1 };
  });
  await page.goto('/exam/' + source.id);
  const timer = page.getByRole('group', { name: 'Tiempo de la pregunta activa' });
  await expect(timer).toContainText('00:07', { timeout: 6000 });
  for (let i = 0; i < source.count; i++) await page.locator('button.w-full.text-left').nth(i).click();
  await page.getByRole('button', { name: 'Confirmar y Continuar' }).click();
  await expect(page.getByText('Pregunta 2 de 2', { exact: true }).first()).toBeVisible();
  await expect(timer).toContainText(/00:(09|10)/);
});

async function historyAccount(page, suffix) {
  await page.goto('/');
  return page.evaluate(async suffix => {
    const { default: api } = await import('/src/services/api.ts');
    const name = suffix + Date.now();
    const account = await api.register(name + '@example.test', name, 'browser-history-password');
    api.setToken(account.data.token);
    localStorage.setItem('ccna_user', JSON.stringify(account.data.user));
    return account.data.user.id;
  }, suffix);
}

test('history displays stored blueprint version, original language and fractional scores in both UI languages', async ({ page }) => {
  await historyAccount(page, 'trace');
  const attemptId = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const exam = await api.createExam({ questionCount: 3, mode: 'custom', language: 'es', strictMode: true, randomize: false });
    await api.startExam(exam.data.examId);
    return exam.data.examId;
  });
  const { PrismaClient } = require('../../server/node_modules/@prisma/client');
  const db = new PrismaClient({ datasourceUrl: process.env.CCNA_BROWSER_DATABASE_URL });
  const row = await db.examQuestion.findFirstOrThrow({ where: { examId: attemptId, questionOrder: 0 } });
  const captured = JSON.parse(row.contentSnapshot).question;
  const correct = captured.options.filter(option => option.isCorrect).map(option => option.id);
  await page.evaluate(async ({ id, examQuestionId, correct }) => {
    const { default: api } = await import('/src/services/api.ts');
    await api.submitExamAnswer(id, { examQuestionId, selectedOptionIds: correct });
    await api.completeExam(id);
  }, { id: attemptId, examQuestionId: row.id, correct });
  await db.$disconnect();
  await page.goto('/history');
  let table = page.getByRole('table', { name: 'Historial de intentos' });
  await expect(table.getByRole('columnheader', { name: 'Versión del temario' })).toBeVisible();
  await expect(table.getByRole('row').nth(1)).toContainText(captured.examVersion);
  await expect(table.getByRole('row').nth(1)).toContainText('ES');
  await expect(table.getByRole('row').nth(1).getByRole('cell').nth(4)).toContainText('33.3%');
  const filter = page.getByRole('combobox', { name: 'Filtrar historial por modalidad' });
  await expect(filter.locator('option')).toHaveCount(8);
  await filter.selectOption('command_practice');
  await expect(table).toContainText('No hay intentos para esta modalidad.');
  await filter.selectOption('custom');
  await expect(table.getByRole('row').nth(1).getByRole('cell').nth(4)).toContainText('33.3%');
  await page.evaluate(() => localStorage.setItem('ccna_simulator_language', 'en'));
  await page.reload();
  table = page.getByRole('table', { name: 'Attempt history' });
  await expect(table.getByRole('columnheader', { name: 'Exam blueprint version' })).toBeVisible();
  await expect(table.getByRole('row').nth(1)).toContainText(captured.examVersion);
  await expect(table.getByRole('row').nth(1).getByRole('cell').nth(4)).toContainText('33.3%');
  await expect(table.getByRole('row').nth(1)).toContainText('ES');
});

test('history loading errors are visible and retry recovers without claiming the account has no attempts', async ({ page }) => {
  await historyAccount(page, 'retryhist');
  await page.route('**/api/exams/history', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ success: false, error: 'Test-only history outage' }) }));
  await page.goto('/history');
  await expect(page.getByRole('alert')).toContainText('No se pudo cargar el historial.');
  await expect(page.getByText('No hay exámenes completados todavía.', { exact: false })).toHaveCount(0);
  await page.unroute('**/api/exams/history');
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('table', { name: 'Historial de intentos' })).toContainText('No hay exámenes completados todavía.');
});

test('changing study topic creates a filtered practice, blocks empty topics and preserves the original attempt', async ({ page }) => {
  await page.goto('/');
  const source = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const result = await api.createExam({ questionCount: 2, language: 'es', mode: 'custom', studyMode: true, strictMode: false, untimed: true, randomize: false, showExplanations: false, soundEnabled: false });
    await api.startExam(result.data.examId);
    const question = (await api.getExamQuestion(result.data.examId, 0)).data;
    await api.submitExamAnswer(result.data.examId, { examQuestionId: question.examQuestionId, selectedOptionIds: question.options.slice(0, question.multipleAnswerCount || 1).map(option => option.id) });
    const before = (await api.getExamQuestion(result.data.examId, 0)).data;
    const topics = (await api.getTopics()).data;
    return { id: result.data.examId, before, target: topics.find(topic => topic.validatedCount > 0 && topic.nameEs !== question.topicName), empty: topics.find(topic => topic.validatedCount === 0) };
  });
  expect(source.target).toBeTruthy();
  expect(source.empty).toBeTruthy();
  await page.goto('/exam/' + source.id);
  await page.getByRole('button', { name: 'Cambiar de tema', exact: true }).click();
  const form = page.getByRole('form', { name: 'Nueva práctica por tema' });
  const topic = form.getByLabel('Tema de la nueva práctica');
  await topic.selectOption(source.empty.id);
  await expect(form).toContainText('no hay preguntas aprobadas para estos filtros');
  await expect(form.getByRole('button', { name: 'Iniciar práctica del tema' })).toBeDisabled();
  await topic.selectOption(source.target.id);
  await expect(form.getByRole('button', { name: 'Iniciar práctica del tema' })).toBeEnabled();
  await form.getByRole('button', { name: 'Iniciar práctica del tema' }).click();
  await expect(page).not.toHaveURL('/exam/' + source.id);
  await expect(page.getByRole('button', { name: 'Volver al intento original' })).toBeVisible();
  const freshId = page.url().split('/exam/')[1];
  const fresh = await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    return { state: (await api.getExamState(id)).data, question: (await api.getExamQuestion(id, 0)).data };
  }, freshId);
  expect(fresh.state.config).toMatchObject({ mode: 'topic_practice', topics: [source.target.id], practiceSourceExamId: source.id, untimed: true, showExplanations: false, soundEnabled: false });
  expect(fresh.question.topicName).toBe(source.target.nameEs);
  await page.reload();
  await page.getByRole('button', { name: 'Volver al intento original' }).click();
  await expect(page).toHaveURL('/exam/' + source.id);
  expect(await page.evaluate(async id => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getExamQuestion(id, 0)).data;
  }, source.id)).toEqual(source.before);
});

test('study topic availability errors block creation and recover through retry', async ({ page }) => {
  await page.goto('/');
  const source = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const exam = await api.createExam({ questionCount: 2, language: 'es', mode: 'custom', studyMode: true, strictMode: false, untimed: true });
    await api.startExam(exam.data.examId);
    const topics = (await api.getTopics()).data;
    return { id: exam.data.examId, topicId: topics.find(topic => topic.validatedCount > 0).id };
  });
  await page.goto('/exam/' + source.id);
  await page.route('**/api/exams/availability', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ success: false, error: 'Test-only topic availability outage' }) }));
  await page.getByRole('button', { name: 'Cambiar de tema', exact: true }).click();
  const form = page.getByRole('form', { name: 'Nueva práctica por tema' });
  await form.getByLabel('Tema de la nueva práctica').selectOption(source.topicId);
  await expect(form.getByRole('alert')).toBeVisible();
  await expect(form.getByRole('button', { name: 'Iniciar práctica del tema' })).toBeDisabled();
  await page.unroute('**/api/exams/availability');
  await form.getByRole('button', { name: 'Reintentar disponibilidad' }).click();
  await expect(form.getByRole('alert')).toHaveCount(0);
  await expect(form.getByRole('button', { name: 'Iniciar práctica del tema' })).toBeEnabled();
  await expect(page).toHaveURL('/exam/' + source.id);
});

test('reviewed bank approvals are audited and enable a real 100-question exam without pending candidates', async ({ page }) => {
  await page.goto('/');
  const before = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    return (await api.getAdminStats()).data;
  });
  const { execFileSync } = require('node:child_process');
  const { resolve } = require('node:path');
  const result = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', 'prisma/sync-reviewed-bank.ts', '--apply'], {
    cwd: resolve(__dirname, '../../server'), encoding: 'utf8',
    env: { ...process.env, DATABASE_URL: process.env.CCNA_BROWSER_DATABASE_URL },
  }));
  expect(result.appliedApprovals).toBe(420);
  expect(result.appliedRejections).toBe(38);
  const setup = await page.evaluate(async () => {
    const { default: api } = await import('/src/services/api.ts');
    const stats = (await api.getAdminStats()).data;
    const exam = await api.createExam({ questionCount: 100, durationMinutes: 120, language: 'es', mode: 'full_simulation', strictMode: true, randomize: true });
    if (!exam.success) throw new Error(exam.error);
    await api.startExam(exam.data.examId);
    return { stats, id: exam.data.examId };
  });
  expect(setup.stats.totalQuestions - before.totalQuestions).toBe(698);
  expect(setup.stats.validatedQuestions - before.validatedQuestions).toBe(420);
  await page.goto('/exam/' + setup.id);
  await expect(page.getByText('Pregunta 1 de 100', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmar y Continuar' })).toBeVisible();
  const { PrismaClient } = require('../../server/node_modules/@prisma/client');
  const db = new PrismaClient({ datasourceUrl: process.env.CCNA_BROWSER_DATABASE_URL });
  const selected = await db.examQuestion.findMany({ where: { examId: setup.id }, include: { question: true } });
  expect(selected).toHaveLength(100);
  expect(selected.every(item => item.question.validationStatus === 'validated' && item.contentSnapshot)).toBe(true);
  expect(new Set(selected.map(item => item.question.questionFamilyId || item.questionId)).size).toBe(100);
  expect(await db.questionReview.count({ where: { reviewerId: 'system-assisted-bank-review', status: 'validated' } })).toBe(420);
  expect(await db.questionReview.count({ where: { reviewerId: 'system-assisted-bank-review', status: 'rejected' } })).toBe(38);
  await db.$disconnect();
});
