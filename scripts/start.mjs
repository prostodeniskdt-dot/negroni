import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function sanitizeDatabaseUrl(raw) {
  if (!raw) return raw;
  let s = String(raw).trim();
  if (
    (s.startsWith('"') && s.endsWith('"') && s.length >= 2) ||
    (s.startsWith("'") && s.endsWith("'") && s.length >= 2)
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

const rawPort = process.env.PORT;
const port = Number.parseInt(rawPort ?? '', 10);
const resolvedPort = Number.isFinite(port) && port >= 0 ? port : 3000;

const rawHost = process.env.APP_HOST ?? process.env.HOST ?? '';
const host = rawHost.trim() || '0.0.0.0';

const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');

function run(cmd, args) {
  execFileSync(cmd, args, { stdio: 'inherit', env: process.env });
}

function tryPrismaMigrateDeploy() {
  const dbUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);
  if (!dbUrl) return;
  process.env.DATABASE_URL = dbUrl;
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    // eslint-disable-next-line no-console
    console.error('[startup] DATABASE_URL must start with postgresql:// or postgres://');
    return;
  }
  const prismaCli = path.join(process.cwd(), 'node_modules', 'prisma', 'build', 'index.js');
  const hasMigrations = fs.existsSync(path.join(process.cwd(), 'prisma', 'migrations'));
  if (hasMigrations) {
    run(process.execPath, [prismaCli, 'migrate', 'deploy']);
    return;
  }
  // This repo currently doesn't ship migrations. `db push` keeps prod usable,
  // and you can introduce migrations later when the schema stabilizes.
  run(process.execPath, [prismaCli, 'db', 'push']);
}

function tryBootstrapAdmin() {
  const dbUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);
  if (!dbUrl) return;
  process.env.DATABASE_URL = dbUrl;
  run(process.execPath, [path.join(process.cwd(), 'scripts', 'bootstrap-admin.mjs')]);
}

try {
  // Important: do not crash the container before Next starts.
  // If DB init fails due to env/SSL, the app should still respond to /api/health.
  tryPrismaMigrateDeploy();
  tryBootstrapAdmin();
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('[startup] prisma init failed (continuing to start Next)');
  // eslint-disable-next-line no-console
  console.error(e);
}

const child = spawn(process.execPath, [nextBin, 'start', '-H', host, '-p', String(resolvedPort)], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

