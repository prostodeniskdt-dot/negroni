#!/bin/sh
set -eu

# Docker sets HOSTNAME to the container id. Next.js standalone uses that
# value as the bind address, so the process never listens on 0.0.0.0 and
# the healthcheck to 127.0.0.1 fails.
export HOSTNAME=0.0.0.0

if [ -z "${PORT:-}" ]; then
  PORT=3000
  export PORT
fi

cd /app
exec node server.js
