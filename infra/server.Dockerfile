# Server Dockerfile - multi-stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
COPY server/package.json server/tsconfig.json server/ ./
COPY prisma prisma/
RUN yarn install --frozen-lockfile
RUN yarn workspace oasis-server prisma:generate
RUN yarn workspace oasis-server build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/prisma ./prisma
COPY infra/server-entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
COPY server/.env.example ./server/.env
COPY uploads ./uploads
EXPOSE 4000
CMD ["./entrypoint.sh"]