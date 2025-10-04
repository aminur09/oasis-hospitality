import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const postCreateSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  excerpt: z.string().optional(),
  body: z.string().min(1),
  featuredImageId: z.string().optional(),
  category: z.enum(['NEWS', 'INSIGHTS', 'PRESS', 'CASE_STUDIES']),
  tags: z.array(z.string()).optional(),
  publishedAt: z.string().datetime().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImageId: z.string().optional()
});

export const projectCreateSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  featuredImageId: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  locationCity: z.string(),
  locationState: z.string(),
  brandFlag: z.string().optional(),
  keys: z.number().int().min(0),
  servicesProvided: z.array(z.string()).optional(),
  timelineStart: z.string().datetime().optional(),
  timelineEnd: z.string().datetime().optional(),
  projectType: z.enum(['NEW_BUILD', 'RENOVATION', 'BRAND_CONVERSION', 'MANAGEMENT_ONLY']),
  highlights: z.array(z.string()).optional(),
  body: z.string().min(1),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImageId: z.string().optional()
});

export const careerCreateSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  featuredImageId: z.string().optional(),
  location: z.string(),
  department: z.string(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'SEASONAL', 'CONTRACT']),
  compensationRange: z.string().optional(),
  applyEmail: z.string().email(),
  body: z.string().min(1),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional()
});

export const settingsUpdateSchema = z.object({
  brandName: z.string(),
  tagline: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  darkColor: z.string(),
  lightColor: z.string(),
  accentColor: z.string(),
  siteTitleSuffix: z.string().optional(),
  defaultDescription: z.string().optional(),
  ga4Id: z.string().optional(),
  socials: z.record(z.any()).optional()
});