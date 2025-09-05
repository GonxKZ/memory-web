import { spawn } from 'child_process';
import { mkdirSync, writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

const logsDir = join(process.cwd(), 'logs');
mkdirSync(logsDir, { recursive: true });
const logPath = join(logsDir, 'live-errors.log');

writeFileSync(logPath, `=== Live Diagnostics started at ${new Date().toISOString()} ===\n`);

function log(line) {
  appendFileSync(logPath, line.endsWith('\n') ? line : line + '\n');
}

function spawnWithPrefix(name, cmd, args) {
  const child = spawn(process.platform === 'win32' ? `${cmd}.cmd` : cmd, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const prefix = `[${name}]`;
  const onData = (buf, streamName) => {
    const text = buf.toString();
    // Split and re-prefix each line
    text.split(/\r?\n/).forEach((line) => {
      if (!line.trim()) return;
      const out = `${prefix} ${streamName}: ${line}\n`;
      process.stdout.write(out);
      log(out);
    });
  };

  child.stdout.on('data', (d) => onData(d, 'out'));
  child.stderr.on('data', (d) => onData(d, 'err'));
  child.on('close', (code) => {
    const msg = `${prefix} exited with code ${code}`;
    process.stdout.write(msg + '\n');
    log(msg);
  });
  return child;
}

const children = [];

// optional duration in seconds: --duration=60
const durationArg = process.argv.find(a => a.startsWith('--duration='));
const durationSec = durationArg ? parseInt(durationArg.split('=')[1], 10) : null;

children.push(spawnWithPrefix('vite', 'npm', ['run', 'dev']));
// ESLint runner (periodic, because --watch is not supported with flat config)
let eslintRunning = false;
const eslintArgs = ['eslint', '.', '--ext', '.ts,.tsx'];
const runEslint = () => {
  if (eslintRunning) return;
  eslintRunning = true;
  const child = spawnWithPrefix('eslint', 'npx', eslintArgs);
  children.push(child);
  child.on('close', () => { eslintRunning = false; });
};
runEslint();

const intervalArg = process.argv.find(a => a.startsWith('--eslint-interval='));
const eslintIntervalSec = intervalArg ? parseInt(intervalArg.split('=')[1], 10) : 45;
const eslintTimer = setInterval(runEslint, eslintIntervalSec * 1000);
children.push(spawnWithPrefix('tsc', 'npx', ['tsc', '-b', '--watch']));

console.log(`[diagnostics] Writing combined output to ${logPath}`);
console.log('[diagnostics] Press Ctrl+C to stop.');

if (durationSec) {
  setTimeout(() => {
    console.log(`[diagnostics] Duration ${durationSec}s elapsed. Stopping watchers...`);
    for (const c of children) {
      try { c.kill('SIGTERM'); } catch {}
    }
    clearInterval(eslintTimer);
    process.exit(0);
  }, durationSec * 1000);
}
