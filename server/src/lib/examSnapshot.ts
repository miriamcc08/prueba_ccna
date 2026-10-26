import { createHash, randomInt } from 'node:crypto';
import { AppError } from '../middleware/errorHandler';

// Snapshots are server-only: public DTOs still explicitly omit answer keys.
export function captureQuestion<T extends { id: string; options: Array<{ id: string; optionLabel: string; displayOrder: number }> }>(question: T, chooseIndex: (upper: number) => number = randomInt): string {
  const content = JSON.parse(JSON.stringify(question)) as T;
  const sourceText = JSON.stringify(content);
  // Reordering label-dependent material could change its meaning; require editorial review.
  const labelDependent = /\b(?:option|choice|answer|opci[oó]n|respuesta)\s+[A-F]\b/i.test(sourceText);
  if (!labelDependent) {
    for (let i = content.options.length - 1; i > 0; i--) {
      const j = chooseIndex(i + 1);
      if (!Number.isInteger(j) || j < 0 || j > i) throw new Error('Invalid shuffle index');
      [content.options[i], content.options[j]] = [content.options[j], content.options[i]];
    }
    content.options.forEach((option, i) => { option.optionLabel = String.fromCharCode(65 + i); option.displayOrder = i; });
  }
  const serialized = JSON.stringify(content);
  return JSON.stringify({ version: 1, sha256: createHash('sha256').update(serialized).digest('hex'), optionsShuffled: !labelDependent, shuffleSkippedReason: labelDependent ? 'label_references' : null, question: content });
}

export function storedQuestion<T extends { id: string }>(row: { contentSnapshot?: string | null; question: T }): T {
  // Existing attempts predate content capture; never manufacture historical evidence for them.
  if (!row.contentSnapshot) return row.question;
  try {
    const snapshot = JSON.parse(row.contentSnapshot);
    const digest = createHash('sha256').update(JSON.stringify(snapshot.question)).digest('hex');
    if (snapshot.version !== 1 || snapshot.sha256 !== digest || snapshot.question.id !== row.question.id || !Array.isArray(snapshot.question.options) || !snapshot.question.primaryTopic) throw new Error('Invalid snapshot');
    return snapshot.question as T;
  } catch {
    throw new AppError(500, 'The saved exam question failed its integrity check.');
  }
}
