# syntax=docker/dockerfile:1

# --- build: install deps and build Next ---
# better-sqlite3 ships N-API prebuilds for linux x64/arm64, so no compiler toolchain is needed.
FROM node:24-bookworm-slim AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# The build prerenders a few cached reads, so it gets a throwaway database.
RUN NEXT_OUTPUT=standalone DATABASE_PATH=/tmp/build.db pnpm exec next build

# --- runtime: just the standalone server, static assets and SQL migrations ---
FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    ROOT_DOMAIN=localhost \
    DATABASE_PATH=/data/store.db
WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/drizzle ./drizzle
# The database is created, migrated and seeded on first start, and persists in this volume.
VOLUME /data
EXPOSE 3000
CMD ["node", "server.js"]
