import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import sanitizeHtml from 'sanitize-html';
import { prisma } from '../server';
import { requireAuth, requireRole } from '../middlewares/auth';
import { ApiError } from '../utils/error';

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type'));
  }
});

export const assetsRouter = Router();

// Publicly serve files from disk
assetsRouter.get('/:key', async (req, res) => {
  const key = req.params.key;
  const filePath = path.join(uploadDir, key);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
  res.sendFile(filePath);
});

// Admin upload endpoint
assetsRouter.post('/upload', requireAuth, requireRole(['ADMIN', 'EDITOR']), upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) throw new ApiError(400, 'No file provided');

    const id = Date.now() + '-' + Math.random().toString(36).slice(2);
    let key = '';
    let width: number | undefined;
    let height: number | undefined;
    let url = '';
    const ext = file.mimetype === 'image/png' ? 'png' :
      file.mimetype === 'image/jpeg' ? 'jpg' :
      file.mimetype === 'image/webp' ? 'webp' :
      file.mimetype === 'image/svg+xml' ? 'svg' : 'bin';

    key = `${id}.${ext}`;
    const dest = path.join(uploadDir, key);

    if (ext === 'svg') {
      const sanitized = sanitizeHtml(file.buffer.toString('utf-8'), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['title', 'desc']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          svg: ['xmlns', 'role', 'aria-labelledby', 'viewBox', 'width', 'height'],
          path: ['d', 'fill', 'stroke', 'stroke-width']
        },
        disallowedTagsMode: 'discard'
      });
      fs.writeFileSync(dest, sanitized);
    } else {
      const image = sharp(file.buffer);
      const meta = await image.metadata();
      width = meta.width;
      height = meta.height;
      await image.toFile(dest);
    }

    url = `/uploads/${key}`;

    const media = await prisma.media.create({
      data: {
        key,
        url,
        alt: req.body.alt || null,
        mimeType: file.mimetype,
        size: file.size,
        width: width || null,
        height: height || null,
        createdBy: (req as any).user?.sub
      }
    });

    res.status(201).json(media);
  } catch (e) {
    next(e);
  }
});

export default assetsRouter;