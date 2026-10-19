FROM node:22-slim AS base

WORKDIR /app

RUN DEBIAN_FRONTEND=noninteractive apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV HOST=0.0.0.0
ENV PORT=3000

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/pdf/fonts ./fonts
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
# Git on Windows can commit CRLF; a CR in the shebang makes the container
# exit with "no such file or directory" before Node starts.
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
    && chmod 755 /usr/local/bin/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

# curl, not a second Node process: a Node probe competes with the server
# during boot and keeps the platform in "starting" for the whole start-period.
HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=5 \
  CMD curl --fail --silent --show-error --max-time 2 "http://127.0.0.1:${PORT:-3000}/api/health"

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]
