import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_ME';
const PREVIEW_SECRET = process.env.PREVIEW_SECRET || JWT_SECRET;

export interface JwtPayload {
  sub: string; // user id
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  email: string;
}

export function signJwt(payload: JwtPayload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

// Preview tokens for draft content
export interface PreviewPayload {
  type: 'post' | 'project' | 'career';
  slug: string;
  sub: string; // user id requesting preview
}

export function signPreview(payload: PreviewPayload, expiresIn = '10m') {
  return jwt.sign(payload, PREVIEW_SECRET, { expiresIn });
}

export function verifyPreview(token: string): PreviewPayload {
  return jwt.verify(token, PREVIEW_SECRET) as PreviewPayload;
}