import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
router.use(requireAuth, requireAdmin);
const fields = { id: true, email: true, username: true, role: true, language: true, deletedAt: true, createdAt: true } as const;
const reason = z.string().trim().min(20).max(2000);
const password = z.string().min(12).refine(value => Buffer.byteLength(value, 'utf8') <= 72, 'Maximum 72 UTF-8 bytes');
const profile = z.object({
  email: z.string().trim().email().transform(v => v.toLowerCase()),
  username: z.union([z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/), z.string().trim().email().max(254)]),
  language: z.enum(['en', 'es']).default('es'),
  role: z.enum(['user', 'admin', 'superadmin']).default('user'),
});
router.get('/', async (req, res, next) => {
  try {
    const filter = z.object({ search: z.string().max(100).default(''), page: z.coerce.number().int().min(1).default(1), removed: z.enum(['true','false']).default('false') }).parse(req.query);
    const where = { role: { in: ['user','admin','superadmin'] }, deletedAt: filter.removed === 'true' ? { not: null } : null,
      OR: [{ email: { contains: filter.search } }, { username: { contains: filter.search } }] };
    const [users,total] = await prisma.$transaction([prisma.user.findMany({ where, select: fields, orderBy: [{ createdAt: 'desc' }, { id: 'asc' }], skip: (filter.page-1)*25, take: 25 }), prisma.user.count({ where })]);
    res.json({ success: true, data: { users, total, page: filter.page, totalPages: Math.max(1,Math.ceil(total/25)) } });
  } catch (error) { next(error); }
});
router.post('/', async (req, res, next) => {
  try {
    const input = profile.extend({ password, reason }).strict().parse(req.body);
    const hash = await bcrypt.hash(input.password,12);
    const user = await prisma.$transaction(async tx => {
      const actor = await tx.user.findUniqueOrThrow({ where: { id: req.user!.id } });
      if (actor.deletedAt || !['admin','superadmin'].includes(actor.role)) throw new AppError(403, 'Administrative access revoked.');
      if (actor.role !== 'superadmin' && input.role !== 'user') throw new AppError(403,'Only superadmin can grant administrative roles.');
      const created = await tx.user.create({ data: { email: input.email, username: input.username, language: input.language, role: input.role, passwordHash: hash }, select: fields });
      await tx.userAccountAudit.create({ data: { actorId: actor.id, targetId: created.id, action: 'create', afterJson: JSON.stringify(created), reason: input.reason } });
      return created;
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) { next(error); }
});
for (const action of ['update','remove','restore'] as const) {
  const method = action === 'update' ? 'put' : action === 'remove' ? 'delete' : 'post';
  const path = action === 'restore' ? '/:id/restore' : '/:id';
  router[method](path, async (req, res, next) => {
    try {
      const update = action === 'update' ? profile.extend({ password: password.optional(), reason }).strict().parse(req.body) : null;
      const input = update || z.object({ reason }).strict().parse(req.body);
      const hash = update?.password ? await bcrypt.hash(update.password,12) : undefined;
      const result = await prisma.$transaction(async tx => {
        const actor = await tx.user.findUniqueOrThrow({ where: { id: req.user!.id } });
        const target = await tx.user.findUnique({ where: { id: req.params.id as string } });
        if (!target || !['user','admin','superadmin'].includes(target.role)) throw new AppError(404,'Account not found.');
        if (actor.deletedAt || !['admin','superadmin'].includes(actor.role)) throw new AppError(403,'Administrative access revoked.');
        if (actor.role !== 'superadmin' && (target.role !== 'user' || (update && update.role !== 'user'))) throw new AppError(403,'Only superadmin can manage administrative roles and accounts.');
        if (target.id === actor.id && (action !== 'update' || update?.role !== actor.role)) throw new AppError(409,'You cannot remove or change your own role.');
        if (target.role === 'superadmin' && (action === 'remove' || (update && update.role !== 'superadmin')) && await tx.user.count({ where: { role: 'superadmin', deletedAt: null } }) <= 1) throw new AppError(409,'The last active superadmin must be preserved.');
        if (action === 'restore' ? !target.deletedAt : Boolean(target.deletedAt)) throw new AppError(409, action === 'restore' ? 'Account is already active.' : 'Restore the account before editing it.');
        const before = { id: target.id, email: target.email, username: target.username, role: target.role, language: target.language, deletedAt: target.deletedAt };
        const data = update ? { email: update.email, username: update.username, role: update.role, language: update.language, ...(hash ? { passwordHash: hash } : {}), authVersion: { increment: 1 } } : { deletedAt: action === 'remove' ? new Date() : null, ...(action === 'restore' ? { role: 'user' } : {}), authVersion: { increment: 1 } };
        const saved = await tx.user.update({ where: { id: target.id }, data, select: fields });
        await tx.userAccountAudit.create({ data: { actorId: actor.id, targetId: target.id, action, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(saved), reason: input.reason } });
        return saved;
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  });
}
router.get('/:id/audit', async (req, res, next) => {
  try {
    if (req.user!.role !== 'superadmin') throw new AppError(403,'Superadmin required.');
    const data = await prisma.userAccountAudit.findMany({ where: { targetId: req.params.id as string }, orderBy: { createdAt: 'desc' }, take: 100 });
    res.json({ success: true, data });
  } catch (error) { next(error); }
});
export default router;
