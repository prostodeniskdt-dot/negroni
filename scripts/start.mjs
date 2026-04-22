import { spawn } from 'node:child_process';
import path from 'node:path';

const rawPort = process.env.PORT;
const port = Number.parseInt(rawPort ?? '', 10);
const resolvedPort = Number.isFinite(port) && port >= 0 ? port : 3000;

const rawHost = process.env.HOSTNAME ?? process.env.HOST ?? '';
const host = rawHost.trim() || '0.0.0.0';

const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');

const child = spawn(process.execPath, [nextBin, 'start', '-H', host, '-p', String(resolvedPort)], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

