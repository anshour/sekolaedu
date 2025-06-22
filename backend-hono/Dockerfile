FROM oven/bun:1.2

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --chown=hono:nodejs . .

RUN bun install --frozen-lockfile

USER hono
EXPOSE 8080

CMD ["bun", "run", "/app/src/index.ts"]