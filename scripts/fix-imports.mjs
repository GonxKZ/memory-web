#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

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

const needsRecharts = [
  'BarChart', 'Bar', 'LineChart', 'Line', 'AreaChart', 'Area', 'PieChart', 'Pie', 'Cell',
]

let changed = 0
for (const file of files) {
  let text = readFileSync(file, 'utf8')
  const orig = text

  // Uncomment commented imports for Badge/Progress
  text = text.replace(/^[ \t]*\/\/\s*import\s*\{\s*Badge\s*\}\s*from\s*"@\/components\/ui\/badge"\s*;?\s*$/gm,
    'import { Badge } from "@/components/ui/badge"')
  text = text.replace(/^[ \t]*\/\/\s*import\s*\{\s*Progress\s*\}\s*from\s*"@\/components\/ui\/progress"\s*;?\s*$/gm,
    'import { Progress } from "@/components/ui/progress"')

  // Add missing Badge import if <Badge appears
  if (/\<Badge\b/.test(text) && !/from\s+"@\/components\/ui\/badge"/.test(text)) {
    text = text.replace(/(import[^\n]*;\s*)+/, (m) => m + 'import { Badge } from "@/components/ui/badge"\n')
  }
  // Add missing Progress import if Progress used
  if (/\bProgress\s*\=|\<Progress\b/.test(text) && !/from\s+"@\/components\/ui\/progress"/.test(text)) {
    text = text.replace(/(import[^\n]*;\s*)+/, (m) => m + 'import { Progress } from "@/components/ui/progress"\n')
  }

  // Ensure recharts import includes used symbols
  if (text.includes('from "recharts"')) {
    const used = needsRecharts.filter(sym => new RegExp(`\\b${sym}\\b`).test(text))
    text = text.replace(/import\s*\{([\s\S]*?)\}\s*from\s*"recharts"/m, (m, inner) => {
      const current = inner.split(',').map(s => s.trim()).filter(Boolean)
      const set = new Set(current)
      for (const u of used) set.add(u)
      const list = Array.from(set).sort().join(', ')
      return `import { ${list} } from "recharts"`
    })
  }

  if (text !== orig) {
    writeFileSync(file, text)
    changed++
  }
}

console.log(`[fix-imports] Updated ${changed} files`)

