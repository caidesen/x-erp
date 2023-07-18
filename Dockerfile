FROM node:20-alpine as builder
WORKDIR /builder
RUN npm install -g pnpm prisma
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile
ENV NODE_ENV=production
RUN pnpm --filter=@trpc-admin/server build
RUN pnpm --filter=@trpc-admin/admin build
RUN pnpm --filter=@trpc-admin/server --prod deploy /app/pruned
RUN cd /app/pruned && prisma generate


FROM node:20-alpine as pruned
WORKDIR /app
COPY --from=builder /app/pruned .

FROM node:20-alpine as assets
WORKDIR /app
COPY --from=builder /builder/packages/admin/dist ./web

FROM node:20-alpine as runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV STATIC_PATH=./web
ENV SERVER_PORT=4000

COPY --from=assets /app .
COPY --from=pruned /app .
EXPOSE 4000
CMD ["node", "dist/index.js"]
