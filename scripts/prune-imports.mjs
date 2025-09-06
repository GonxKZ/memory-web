#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const root = process.cwd()

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) yield* walk(p)
    else yield p
  }
}

const files = Array.from(walk(join(root, 'src'))).filter(p =>
  ['.tsx', '.ts'].includes(extname(p)) && p.includes(join('src', 'features'))
)

let changed = 0
for (const file of files) {
  let text = readFileSync(file, 'utf8')
  const orig = text

  // 1) Podar Badge/Progress cuando no se usan
  const usesBadge = /<\s*Badge\b/.test(text)
  const usesProgress = /<\s*Progress\b/.test(text)
  text = text.replace(/import\s*\{\s*Badge\s*\}\s*from\s*"@\/components\/ui\/badge"\s*;?\n/g, m => (usesBadge ? m : ''))
  text = text.replace(/import\s*\{\s*Progress\s*\}\s*from\s*"@\/components\/ui\/progress"\s*;?\n/g, m => (usesProgress ? m : ''))

  // 2) Reducir import de recharts a solo símbolos usados
  text = text.replace(/import\s*\{([\s\S]*?)\}\s*from\s*"recharts"\s*;?/m, (m, inner) => {
    const names = inner.split(',').map(s => s.trim()).filter(Boolean)
    const used = names.filter(n => new RegExp(`\\b${n}\\b`).test(text))
    if (used.length === 0) return ''
    return `import { ${Array.from(new Set(used)).sort().join(', ')} } from "recharts"\n`
  })

  if (text !== orig) {
    writeFileSync(file, text)
    changed++
  }
}

console.log(`[prune-imports] Updated ${changed} files`)

