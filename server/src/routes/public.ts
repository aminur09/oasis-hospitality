import { Router } from 'express';
import { prisma } from '../server';
import { ApiError } from '../utils/error';

export const publicRouter = Router();

/**
 * News listing
 */
publicRouter.get('/news', async (req, res, next) => {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const perPage = Math.min(parseInt((req.query.perPage as string) || '10', 10), 50);
    const category = (req.query.category as string) || undefined;
    const q = (req.query.q as string) || undefined;

    const where: any = { status: 'PUBLISHED' };
    if (category) where.category = category.toUpperCase();
    if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { body: { contains: q, mode: 'insensitive' } }];

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: perPage,
        skip: (page - 1) * perPage,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          publishedAt: true
        }
      }),
      prisma.post.count({ where })
    ]);

    res.json({ items, page, perPage, total });
  } catch (e) {
    next(e);
  }
});

/**
 * News detail
 */
publicRouter.get('/news/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post || post.status !== 'PUBLISHED') throw new ApiError(404, 'Not found');
    res.json(post);
  } catch (e) {
    next(e);
  }
});

/**
 * Projects listing
 */
publicRouter.get('/projects', async (req, res, next) => {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const perPage = Math.min(parseInt((req.query.perPage as string) || '12', 10), 50);
    const type = (req.query.type as string) || undefined;
    const q = (req.query.q as string) || undefined;

    const where: any = { status: 'PUBLISHED' };
    if (type) where.projectType = type.toUpperCase();
    if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { body: { contains: q, mode: 'insensitive' } }];

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: perPage,
        skip: (page - 1) * perPage,
        select: {
          id: true,
          title: true,
          slug: true,
          locationCity: true,
          locationState: true,
          projectType: true
        }
      }),
      prisma.project.count({ where })
    ]);

    res.json({ items, page, perPage, total });
  } catch (e) {
    next(e);
  }
});

/**
 * Project detail
 */
publicRouter.get('/projects/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project || project.status !== 'PUBLISHED') throw new ApiError(404, 'Not found');
    res.json(project);
  } catch (e) {
    next(e);
  }
});

/**
 * Careers listing
 */
publicRouter.get('/careers', async (req, res, next) => {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const perPage = Math.min(parseInt((req.query.perPage as string) || '10', 10), 50);
    const location = (req.query.location as string) || undefined;
    const dept = (req.query.dept as string) || undefined;

    const where: any = { status: 'PUBLISHED' };
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (dept) where.department = { contains: dept, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      prisma.career.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: perPage,
        skip: (page - 1) * perPage,
        select: {
          id: true,
          title: true,
          slug: true,
          location: true,
          department: true,
          employmentType: true
        }
      }),
      prisma.career.count({ where })
    ]);

    res.json({ items, page, perPage, total });
  } catch (e) {
    next(e);
  }
});

/**
 * Career detail
 */
publicRouter.get('/careers/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const career = await prisma.career.findUnique({ where: { slug } });
    if (!career || career.status !== 'PUBLISHED') throw new ApiError(404, 'Not found');
    res.json(career);
  } catch (e) {
    next(e);
  }
});

/**
 * Settings
 */
publicRouter.get('/settings', async (_req, res, next) => {
  try {
    const s = await prisma.settings.findUnique({ where: { id: 1 } });
    res.json(s);
  } catch (e) {
    next(e);
  }
});

export default publicRouter;