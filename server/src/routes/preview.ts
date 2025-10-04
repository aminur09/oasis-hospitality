import { Router } from 'express';
import { prisma } from '../server';
import { verifyPreview } from '../utils/auth';
import { ApiError } from '../utils/error';

export const previewRouter = Router();

/**
 * GET /api/preview?type=post|project|career&slug=&token=
 * Returns entity regardless of status for short-lived preview access.
 */
previewRouter.get('/', async (req, res, next) => {
  try {
    const type = (req.query.type as string) || '';
    const slug = (req.query.slug as string) || '';
    const token = (req.query.token as string) || '';
    if (!['post', 'project', 'career'].includes(type) || !slug || !token) throw new ApiError(400, 'Invalid preview request');

    // Verify preview token
    const payload = verifyPreview(token);
    if (payload.slug !== slug || payload.type !== type) throw new ApiError(401, 'Invalid preview token');

    const entity =
      type === 'post'
        ? await prisma.post.findUnique({ where: { slug } })
        : type === 'project'
        ? await prisma.project.findUnique({ where: { slug } })
        : await prisma.career.findUnique({ where: { slug } });

    if (!entity) throw new ApiError(404, 'Not found');

    res.json(entity);
  } catch (e) {
    next(e);
  }
});

export default previewRouter;