# Oasis Hospitality — Modern Web App

Production-ready corporate site with admin, built with:
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + TypeScript + Express (modular architecture)
- Database: PostgreSQL + Prisma ORM
- Auth: Email/password with JWT + optional Google OAuth (ID token)
- Admin Panel: Role-based (Admin, Editor, Viewer) to manage Projects, News, Careers
- Hosting: Dockerized (client + server + Postgres), ready for any VM

## Features

- Public SPA (good SEO via server-generated sitemap, robots, RSS)
  - Routes: Home, Services, Development/Renovation, Portfolio, News, Careers, About, Contact, Privacy, Terms
  - Listings with filters and pagination
  - Detail pages with metadata, hero, related items
  - Accessibility: skip-to-content, semantic landmarks, visible focus, keyboard-accessible mobile nav
  - Performance: Vite build, code-splitting, Tailwind design tokens

- Admin (/admin)
  - Auth: login with email/password; optional Google OAuth (send ID token to server)
  - Roles: Admin (full), Editor (content CRUD), Viewer (read-only)
  - CRUD + search + pagination for Posts, Projects, Careers
  - WYSIWYG for content (React Quill)
  - Media upload with server-side resize/sanitization (local disk by default; optional S3/R2)
  - Settings (brand info, colors, SEO defaults)

- API (REST)
  - Public: GET /api/news, /api/news/:slug, /api/projects, /api/projects/:slug, /api/careers, /api/careers/:slug
  - Feeds: GET /sitemap.xml, /robots.txt, /feed.xml
  - Admin (JWT): /api/admin/posts|projects|careers CRUD, /api/admin/settings
  - Validation: Zod schemas
  - Security: Helmet, CORS allowlist, rate-limit auth, secure passwords (Argon2), SVG sanitization

## Monorepo Structure

- /client — React Vite app
- /server — Express + Prisma API
- /prisma — Prisma schema and seed
- /infra — Dockerfiles and Nginx config
- docker-compose.yml — local and production orchestration

## Brand / Global Config

Defaults are seeded into the `Settings` table. You can update them via Admin → Settings or via CLI:
- BRAND_NAME: Oasis Hospitality
- TAGLINE: Your property’s growth starts with the right partner.
- PRIMARY_CONTACT:
  - address: 900 37TH AVE SW, Minot, ND 58701
  - phone: 701-484-1244
  - email: info@oasishospitality.net
- COLOR_PALETTE: primary #0E6E6E, secondary #C19A6B, dark #0B1B1E, light #F7F8F8, accent #4C63FF
- TYPOGRAPHY: Inter variable + Playfair Display (headings)

## Environment

server/.env.example:
- PORT=4000
- DATABASE_URL=postgresql://postgres:postgres@db:5432/oasis?schema=public
- JWT_SECRET=supersecretchange
- CORS_ORIGIN=http://localhost,http://localhost:8080
- PUBLIC_BASE_URL=http://localhost
- UPLOAD_DIR=/app/uploads
- OAUTH_GOOGLE_CLIENT_ID=
- OAUTH_GOOGLE_CLIENT_SECRET=
- FILE_STORAGE=local (switch to s3 via env)

client/.env.example:
- VITE_API_BASE_URL=http://localhost/api
- VITE_BRAND_NAME=Oasis Hospitality
- VITE_GA4_ID=

## Local Setup (without Docker)

Prereqs: Node 20+, Postgres 15+

1. Install dependencies
- yarn install

2. Configure server env
- cp server/.env.example server/.env
- edit DATABASE_URL and JWT_SECRET

3. Run database migrations and seed
- yarn prisma:migrate
- yarn prisma:seed

4. Start dev servers
- yarn dev
- Client on http://localhost:8080
- Server on http://localhost:4000

5. Login to admin
- Seeded admin user:
  - Email: admin@oasis.local
  - Password: ChangeMe123!
- Visit http://localhost:8080/admin/login

## Docker Setup (recommended)

1. Build and start
- docker compose up -d

2. App entry
- Client (served by Nginx): http://localhost
- API proxied at http://localhost/api
- DB on localhost:5432 (Postgres)

3. Migrations and seed
- Exec into server container or run from local:
  - docker compose exec server node -e "console.log('Ensure migrations are applied via Prisma migrate in CI/CD')"
  - For development: run `yarn prisma:migrate && yarn prisma:seed` locally before building images

Note: For production, run Prisma `migrate deploy` against your database during deploy.

## Admin Panel

- /admin/login: Email/password
- /admin/posts: Create, update, delete posts
- /admin/projects: Create, update, delete projects
- /admin/careers: Create, update, delete careers
- /admin/settings: Update brand info and colors

## Switching File Storage

- Default: local disk at /uploads (mounted volume)
- S3/R2: set FILE_STORAGE=s3 and provide S3_BUCKET, S3_REGION, S3_KEY, S3_SECRET
- Implement upload backend integration in `server/src/routes/assets.ts` (placeholder adapters included)

## Security Checklist

- Change JWT_SECRET (strong, rotated periodically)
- Force HTTPS (Cloudways/DO/AWS LB or Nginx with TLS)
- Restrict CORS_ORIGIN to production URL(s)
- Rate limit auth endpoints (enabled)
- Keep dependencies updated
- Use object storage for media in production
- Backups: configure daily pg_dump and restore procedures

## Backup & Restore

- Backup:
  - pg_dump: `pg_dump -h localhost -U postgres -d oasis > backup.sql`
- Restore:
  - `psql -h localhost -U postgres -d oasis < backup.sql`

## Tests

- Server unit tests (Jest): `yarn workspace oasis-server test`
- E2E: Add Playwright tests under client; sample smoke tests can be added

## Acceptance Criteria Reference

- Lighthouse targets achievable with static build and SSR-like metadata via React Helmet + server feeds.
- Admin panel supports full CRUD (Posts, Projects, Careers) with image upload and WYSIWYG.
- Public routes show paginated lists and details from DB.
- Auth: JWT; RBAC enforced on admin API; rate limits active on auth endpoints.
- Sitemap, robots.txt, RSS feed generated by server.
- Docker: `docker compose up -d` brings app up at http://localhost.

## License

MIT