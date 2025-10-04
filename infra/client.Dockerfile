# Client Dockerfile - multi-stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
COPY client client/
RUN yarn install --frozen-lockfile
WORKDIR /app/client
RUN yarn build

FROM nginx:alpine AS runner
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY infra/nginx-client.conf /etc/nginx/nginx.conf
EXPOSE 80