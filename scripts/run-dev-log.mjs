import { spawn } from 'child_process';
import { mkdirSync, createWriteStream, readFileSync } from 'fs';
import { join } from 'path';

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

const durationArg = process.argv.find(a => a.startsWith('--duration='));
const DURATION_MS = durationArg ? parseInt(durationArg.split('=')[1], 10) * 1000 : 60_000; // default 60s

const logsDir = join(process.cwd(), 'logs');
mkdirSync(logsDir, { recursive: true });
const outPath = join(logsDir, `dev-${timestamp()}.log`);

console.log(`[dev:log] Starting dev server, logging to ${outPath} for ${DURATION_MS/1000}s`);

const out = createWriteStream(outPath);

const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'start'], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ['ignore', 'pipe', 'pipe']
});

child.stdout.pipe(out);
child.stderr.pipe(out);

const killer = setTimeout(() => {
  console.log('[dev:log] Duration elapsed, terminating dev server...');
  try { child.kill('SIGTERM'); } catch {}
}, DURATION_MS);

child.on('close', (code) => {
  clearTimeout(killer);
  out.end();
  console.log(`[dev:log] Dev server exited with code ${code}`);
});

