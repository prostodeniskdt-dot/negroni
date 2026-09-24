#!/bin/sh
set -e

# Coolify and Docker set HOSTNAME to the container id. Next.js standalone
# treats that as the bind address, so the process never listens on 0.0.0.0
# and the healthcheck to 127.0.0.1 fails.
export HOSTNAME=0.0.0.0
export PORT="${PORT:-3000}"

exec "$@"
