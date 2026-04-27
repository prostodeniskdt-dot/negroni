import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rawPort = process.env.PORT;
const port = Number.parseInt(rawPort ?? '', 10);
const resolvedPort = Number.isFinite(port) && port >= 0 ? port : 3000;

const rawHost = process.env.APP_HOST ?? '';
const host = rawHost.trim() || '0.0.0.0';

const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');

function run(cmd, args) {
  execFileSync(cmd, args, { stdio: 'inherit', env: process.env });
}

function tryPrismaMigrateDeploy() {
  if (!process.env.DATABASE_URL) return;
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
  if (!process.env.DATABASE_URL) return;
  run(process.execPath, [path.join(process.cwd(), 'scripts', 'bootstrap-admin.mjs')]);
}

try {
  tryPrismaMigrateDeploy();
  tryBootstrapAdmin();
} catch (e) {
  // Fail fast: without migrations/admin bootstrap the app won't be usable.
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
}

const child = spawn(process.execPath, [nextBin, 'start', '-H', host, '-p', String(resolvedPort)], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

