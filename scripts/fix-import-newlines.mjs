#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) yield* walk(p)
    else if (p.endsWith('.ts') || p.endsWith('.tsx')) yield p
  }
}

let changed = 0
for (const file of walk(join(process.cwd(), 'src'))) {
  let text = readFileSync(file, 'utf8')
  const orig = text
  text = text.replace(/"import\s*\{/g, '"\nimport {')
  text = text.replace(/"import\s+/g, '"\nimport ')
  text = text.replace(/"export\s+/g, '"\nexport ')
  if (text !== orig) { writeFileSync(file, text); changed++ }
}
console.log(`[fix-import-newlines] Updated ${changed} files`)
