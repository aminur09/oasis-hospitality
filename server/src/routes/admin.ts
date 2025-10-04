import { Router } from 'express';
import { prisma } from '../server';
import { requireAuth, requireRole } from '../middlewares/auth';
import { ApiError } from '../utils/error';
import { postCreateSchema, projectCreateSchema, careerCreateSchema, settingsUpdateSchema } from '../validation/schemas';
import { signPreview } from '../utils/auth';

export const adminRouter = Router();

adminRouter.use(requireAuth);

// RBAC enforcement
const canEdit = requireRole(['ADMIN', 'EDITOR']);
const adminOnly = requireRole(['ADMIN']);

/**
 * Posts CRUD
 */
adminRouter.get('/posts', canEdit, async (req, res, next) => {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const perPage = Math.min(parseInt((req.query.perPage as string) || '20', 10), 100);
    const where: any = {};
    const [items, total] = await Promise.all([
      prisma.post.findMany({ where, orderBy: { updatedAt: 'desc' }, take: perPage, skip: (page - 1) * perPage }),
      prisma.post.count({ where })
    ]);
    res.json({ items, page, perPage, total });
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/posts', canEdit, async (req, res, next) => {
  try {
    const parsed = postCreateSchema.parse(req.body);
    const authorId = (req as any).user.sub as string;
    const created = await prisma.post.create({
      data: { ...parsed, authorId }
    });
    await prisma.auditLog.create({ data: { entity: 'Post', entityId: created.id, action: 'create', userId: authorId } });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

adminRouter.patch('/posts/:id', canEdit, async (req, res, next) => {
  try {
    const id = req.params.id;
    const parsed = postCreateSchema.partial().parse(req.body);
    const updated = await prisma.post.update({ where: { id }, data: parsed });
    const userId = (req as any).user.sub as string;
    await prisma.auditLog.create({ data: { entity: 'Post', entityId: updated.id, action: 'update', userId } });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

adminRouter.delete('/posts/:id', adminOnly, async (req, res, next) => {
  try {
    const id = req.params.id;
    await prisma.post.delete({ where: { id } });
    const userId = (req as any).user.sub as string;
    await prisma.auditLog.create({ data: { entity: 'Post', entityId: id, action: 'delete', userId } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

/**
 * Projects CRUD
 */
adminRouter.get('/projects', canEdit, async (_req, res, next) => {
  try {
    const items = await prisma.project.findMany({ orderBy: { updatedAt: 'desc' } });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/projects', canEdit, async (req, res, next) => {
  try {
    const parsed = projectCreateSchema.parse(req.body);
    const created = await prisma.project.create({ data: parsed });
    const userId = (req as any).user.sub as string;
    await prisma.auditLog.create({ data: { entity: 'Project', entityId: created.id, action: 'create', userId } });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

adminRouter.patch('/projects/:id', canEdit, async (req, res, next) => {
  try {
    const id = req.params.id;
    const parsed = projectCreateSchema.partial().parse(req.body);
    const updated = await prisma.project.update({ where: { id }, data: parsed });
    const userId = (req as any).user.sub as string;
    await prisma.auditLog.create({ data: { entity: 'Project', entityId: updated.id, action: 'update', userId } });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

adminRouter.delete('/projects/:id', adminOnly, async (req, res, next) => {
  try {
    const id = req.params.id;
    await prisma.project.delete({ where: { id } });
    const userId = (req as any).user.sub as string;
    await prisma.auditLog.create({ data: { entity: 'Project', entityId: id, action: 'delete', userId } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

/**
 * Careers CRUD
 */
adminRouter.get('/careers', canEdit, async (_req, res, next) => {
  try {
    const items = await prisma.career.findMany({ orderBy: { updatedAt: 'desc' } });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/careers', canEdit, async (req, res, next) => {
  try {
    const parsed = careerCreateSchema.parse(req.body);
    const created = await prisma.career.create({ data: parsed });
    const userId = (req as any).user.sub as string;
    await prisma.auditLog.create({ data: { entity: 'Career', entityId: created.id, action: 'create', userId } });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

adminRouter.patch('/careers/:id', canEdit, async (req, res, next) => {
  try {
    const id = req.params.id;
    const parsed = careerCreateSchema.partial().parse(req.body);
    const updated = await prisma.career.update({ where: { id }, data: parsed });
    const userId = (req as any).user.sub as string;
    await prisma.auditLog.create({ data: { entity: 'Career', entityId: updated.id, action: 'update', userId } });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

adminRouter.delete('/careers/:id', adminOnly, async (req, res, next) => {
  try {
    const id = req.params.id;
    await prisma.career.delete({ where: { id } });
    const userId = (req as any).user.sub as string;
    await prisma.auditLog.create({ data: { entity: 'Career', entityId: id, action: 'delete', userId } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

/**
 * Settings
 */
adminRouter.get('/settings', canEdit, async (_req, res, next) => {
  try {
    const s = await prisma.settings.findUnique({ where: { id: 1 } });
    res.json(s);
  } catch (e) {
    next(e);
  }
});

adminRouter.put('/settings', adminOnly, async (req, res, next) => {
  try {
    const parsed = settingsUpdateSchema.parse(req.body);
    const updated = await prisma.settings.update({ where: { id: 1 }, data: parsed });
    const userId = (req as any).user.sub as string;
    await prisma.auditLog.create({ data: { entity: 'Settings', entityId: String(updated.id), action: 'update', userId } });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

/**
 * Preview token issuance
 */
adminRouter.get('/preview-token', canEdit, async (req, res, next) => {
  try {
    const type = (req.query.type as string) || '';
    const slug = (req.query.slug as string) || '';
    if (!['post', 'project', 'career'].includes(type) || !slug) throw new ApiError(400, 'Invalid preview request');

    // Ensure entity exists
    const exists =
      type === 'post'
        ? await prisma.post.findUnique({ where: { slug } })
        : type === 'project'
        ? await prisma.project.findUnique({ where: { slug } })
        : await prisma.career.findUnique({ where: { slug } });

    if (!exists) throw new ApiError(404, 'Entity not found');

    const userId = (req as any).user.sub as string;
    const token = signPreview({ type: type as any, slug, sub: userId });
    const base = process.env.PUBLIC_BASE_URL || 'http://localhost';
    const path =
      type === 'post' ? `/news/${slug}` : type === 'project' ? `/projects/${slug}` : `/careers/${slug}`;

    res.json({ token, previewUrl: `${base}${path}?preview=${encodeURIComponent(token)}` });
  } catch (e) {
    next(e);
  }
});

export default adminRouter;