import { spawn } from 'child_process';
import { mkdirSync, createWriteStream } from 'fs';
import { join } from 'path';

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

const logsDir = join(process.cwd(), 'logs');
mkdirSync(logsDir, { recursive: true });
const outPath = join(logsDir, `eslint-${timestamp()}.log`);
const out = createWriteStream(outPath);

console.log(`[lint:report] Writing ESLint output to ${outPath}`);

const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['eslint', '.', '--ext', '.ts,.tsx'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  cwd: process.cwd(),
  env: process.env,
});

child.stdout.pipe(out);
child.stderr.pipe(out);

child.on('close', (code) => {
  console.log(`[lint:report] ESLint finished with code ${code}`);
  // do not fail the step; report-only
  process.exit(0);
});
