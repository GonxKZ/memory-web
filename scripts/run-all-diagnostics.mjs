import { spawn } from 'child_process';
import { mkdirSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const logsDir = join(process.cwd(), 'logs');
mkdirSync(logsDir, { recursive: true });

function run(cmd, args) {
  return new Promise((resolve) => {
    const child = spawn(process.platform === 'win32' ? `${cmd}.cmd` : cmd, args, { stdio: 'inherit' });
    child.on('close', () => resolve());
  });
}

async function main() {
  console.log('=== Step 1: ESLint to logs ===');
  await run('npm', ['run', '-s', 'lint:report']);
  console.log('=== Step 2: TypeScript to logs ===');
  await run('npm', ['run', '-s', 'typecheck:report']);
  console.log('=== Step 3: Dev server logs (12s) ===');
  await run('npm', ['run', '-s', 'dev:log', '--', '--duration=12']);

  // Print quick summaries (last 40 lines) if present
  const files = readdirSync(logsDir)
    .filter(f => /^(eslint|tsc|dev)-/.test(f))
    .sort();
  console.log('\n=== Logs generated ===');
  for (const f of files) console.log(' -', f);
  const last = (name) => files.filter(f => f.startsWith(name)).slice(-1)[0];

  const printTail = (label, fname) => {
    if (!fname) return;
    console.log(`\n--- Tail of ${label} (${fname}) ---`);
    const text = readFileSync(join(logsDir, fname), 'utf8');
    const lines = text.trim().split(/\r?\n/);
    console.log(lines.slice(-40).join('\n'));
  };

  printTail('ESLint', last('eslint-'));
  printTail('TypeScript', last('tsc-'));
  printTail('Dev', last('dev-'));
}

main().catch(err => {
  console.error('diagnostics failed:', err);
  process.exit(1);
});
