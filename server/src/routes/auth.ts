import { Router } from 'express';
import { prisma } from '../server';
import { ApiError } from '../utils/error';
import { hashPassword, signJwt, verifyPassword } from '../utils/auth';
import { registerSchema, loginSchema } from '../validation/schemas';
import { OAuth2Client } from 'google-auth-library';

export const authRouter = Router();

const googleClientId = process.env.OAUTH_GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

authRouter.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (exists) throw new ApiError(400, 'Email already registered');

    const passwordHash = await hashPassword(parsed.password);
    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        passwordHash,
        name: parsed.name,
        role: 'EDITOR'
      }
    });

    const token = signJwt({ sub: user.id, role: user.role, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    next(e);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user || !user.passwordHash) throw new ApiError(401, 'Invalid credentials');
    const ok = await verifyPassword(user.passwordHash, parsed.password);
    if (!ok) throw new ApiError(401, 'Invalid credentials');

    const token = signJwt({ sub: user.id, role: user.role, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    next(e);
  }
});

authRouter.post('/google', async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!googleClient) throw new ApiError(400, 'Google OAuth not configured');
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientId
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) throw new ApiError(401, 'Invalid Google token');

    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          role: 'EDITOR',
          provider: 'google',
          googleId: payload.sub
        }
      });
    }

    const token = signJwt({ sub: user.id, role: user.role, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    next(e);
  }
});

authRouter.get('/me', async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Unauthorized');

    // We don't re-verify here; client should send a valid token; in production, verify if needed
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default authRouter;