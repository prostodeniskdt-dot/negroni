FROM node:22-slim AS base

WORKDIR /app

RUN DEBIAN_FRONTEND=noninteractive apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps

COPY package.json package-lock.json ./
RUN --mount=type=secret,id=proxy_ca \
    --mount=type=cache,id=negroni-npm,target=/root/.npm \
    if [ -f /run/secrets/proxy_ca ]; then \
      NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca npm ci --no-audit --no-fund; \
    else npm ci --no-audit --no-fund; fi

FROM deps AS assets

# Originals are read-only build inputs, not retained image layers.
RUN --mount=type=bind,source=public,target=/source-public,readonly \
    --mount=type=bind,source=scripts/prepare-public-assets.mjs,target=/app/prepare-public-assets.mjs,readonly \
    node /app/prepare-public-assets.mjs /source-public /app/public

FROM assets AS builder

ENV NEXT_TELEMETRY_DISABLED=1
# A linear stage chain avoids concurrent working copies of node_modules.
# Keep source and build output in one layer; public is excluded from tracing.
RUN --mount=type=bind,source=src,target=/source-src,readonly \
    --mount=type=bind,source=next.config.ts,target=/source-next.config.ts,readonly \
    --mount=type=bind,source=tsconfig.json,target=/source-tsconfig.json,readonly \
    --mount=type=bind,source=postcss.config.mjs,target=/source-postcss.config.mjs,readonly \
    cp -a /source-src ./src \
    && cp /source-next.config.ts ./next.config.ts \
    && cp /source-tsconfig.json ./tsconfig.json \
    && cp /source-postcss.config.mjs ./postcss.config.mjs \
    && npm run build \
    && rm -rf .next/cache

FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV HOST=0.0.0.0
ENV PORT=3000

# Assemble the runtime once, without duplicate media or fonts in earlier layers.
RUN --mount=type=bind,from=builder,source=/app,target=/build-output,readonly \
    --mount=type=bind,source=docker-entrypoint.sh,target=/source-entrypoint.sh,readonly \
    groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs \
    && cp -a /build-output/.next/standalone/. ./ \
    && mkdir -p .next/static \
    && cp -a /build-output/.next/static/. .next/static/ \
    && mkdir -p public \
    && cp -a /build-output/public/. ./public/ \
    && cp /source-entrypoint.sh /usr/local/bin/docker-entrypoint.sh \
    && sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
    && chmod 755 /usr/local/bin/docker-entrypoint.sh \
    && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=5s --start-period=30s --retries=6 \
  CMD curl --noproxy '*' --fail --silent --show-error --max-time 4 "http://127.0.0.1:${PORT:-3000}/api/health"

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]
