import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

/** Local owner setup: existing administrator must prove the current password. */
export async function bootstrapSuperadmin(db: PrismaClient, email?: string, password?: string) {
  if (!email || !password) throw new Error('Set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD to the existing administrator credentials.');
  const normalized = email.trim().toLowerCase();
  return db.$transaction(async tx => {
    const user = await tx.user.findUnique({ where: { email: normalized } });
    if (!user || user.deletedAt || !['admin','superadmin'].includes(user.role) || !await bcrypt.compare(password,user.passwordHash)) throw new Error('An active administrator and its correct password are required.');
    if (user.role === 'superadmin') return 'unchanged';
    if (await tx.user.count({ where: { role: 'superadmin', deletedAt: null } })) throw new Error('A superadmin already exists. Ask that account to grant roles through the panel.');
    await tx.user.update({ where: { id: user.id }, data: { role: 'superadmin', authVersion: { increment: 1 } } });
    await tx.userAccountAudit.create({ data: { actorId: user.id, targetId: user.id, action: 'owner_bootstrap', beforeJson: JSON.stringify({ role: 'admin' }), afterJson: JSON.stringify({ role: 'superadmin' }), reason: 'Local owner explicitly initialized the first superadmin with existing administrator credentials.' } });
    return 'promoted';
  });
}
if (require.main === module) {
  const db = new PrismaClient();
  bootstrapSuperadmin(db,process.env.SUPERADMIN_EMAIL,process.env.SUPERADMIN_PASSWORD)
    .then(status => console.log(status === 'promoted' ? 'Superadmin configured. Sign in again.' : 'Superadmin already configured.'))
    .catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.$disconnect());
}
