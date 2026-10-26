import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

/** Opt-in bootstrap: never resets a password or silently promotes an account. */
export async function bootstrapAdmin(db: PrismaClient, email?: string, password?: string) {
  if (!email && !password) return { status: 'skipped' as const };
  if (!email || !password) throw new Error('Set both ADMIN_EMAIL and ADMIN_PASSWORD.');
  const normalizedEmail = z.string().trim().email().parse(email).toLowerCase();
  if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('ADMIN_PASSWORD must have at least 12 characters and at most 72 UTF-8 bytes.');
  }
  const users = await db.user.findMany({ select: { id: true, email: true, role: true } });
  const matches = users.filter(user => user.email.toLowerCase() === normalizedEmail);
  if (matches.length > 1) throw new Error('Ambiguous existing email; no accounts were changed.');
  const existing = matches[0];
  if (existing) {
    if (existing.role !== 'admin') throw new Error('This email belongs to a non-admin account. Use a separate administrator email; no roles or passwords were changed.');
    return { status: 'unchanged' as const };
  }
  await db.user.create({ data: {
    email: normalizedEmail, username: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 12), role: 'admin', language: 'es',
  } });
  return { status: 'created' as const };
}

if (require.main === module) {
  const db = new PrismaClient();
  bootstrapAdmin(db, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
    .then(result => {
      if (result.status === 'skipped') throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD to bootstrap an administrator.');
      console.log(result.status === 'created' ? 'Administrator created.' : 'Administrator already exists; password preserved.');
    })
    .catch(error => { console.error(error.message); process.exitCode = 1; })
    .finally(() => db.$disconnect());
}
