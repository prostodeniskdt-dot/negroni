FROM node:24-slim

WORKDIR /app

# Prisma requires OpenSSL in slim Debian images.
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

ENV HOST=0.0.0.0
ENV APP_HOST=0.0.0.0
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=18 CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/api/health').then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "scripts/start.mjs"]
