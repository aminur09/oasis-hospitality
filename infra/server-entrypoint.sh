#!/bin/sh
set -e

# Apply Prisma migrations (deploy-safe)
node -e "console.log('Running Prisma migrate deploy...')"
npx prisma migrate deploy --schema ./prisma/schema.prisma

# Start server
node server/dist/index.js