#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process'
import { createServer } from 'node:http'
import { rmSync, existsSync } from 'node:fs'

function log(section, msg) {
  console.log(`[doctor:${section}] ${msg}`)
}

try {
  const v = process.version
  log('env', `Node ${v}`)
  const major = parseInt(v.replace(/^v/, '').split('.')[0], 10)
  if (major < 18) log('env', 'Warning: Node >= 18 recomendado')
} catch {}

// Check port 5173 availability
const port = 5173
const server = createServer(() => {})
server.on('error', () => log('port', `⚠️ Puerto ${port} ocupado`))
server.listen(port, () => {
  log('port', `Puerto ${port} disponible`)
  server.close()
})

// Clean ephemeral dirs if requested
if (process.argv.includes('--clean')) {
  for (const p of ['dist', 'logs', 'node_modules/.vite']) {
    if (existsSync(p)) {
      try { rmSync(p, { recursive: true, force: true }); log('clean', `Removed ${p}`) } catch {}
    }
  }
}

// Run typecheck and eslint (summary only)
const run = (cmd) => spawnSync(cmd, { shell: true, stdio: 'inherit' })
log('typecheck', 'tsc -b')
run('npx tsc -b')
log('lint', 'eslint . --ext .ts,.tsx')
run('npx eslint . --ext .ts,.tsx')

// Try a quick build
log('build', 'vite build (quick)')
run('npm run -s build')

log('ok', 'Doctor finalizado')

