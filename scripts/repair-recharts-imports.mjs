#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const chartSymsAll = new Set(['BarChart','LineChart','CartesianGrid','Legend','Line','ResponsiveContainer','Tooltip','XAxis','YAxis','AreaChart','Area','PieChart','Pie','Cell','Bar'])

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) yield* walk(p)
    else if (p.endsWith('.tsx')) yield p
  }
}

let changed = 0
for (const file of walk(join(root, 'src', 'features'))) {
  let text = readFileSync(file, 'utf8')
  const orig = text

  // 1) Fix wrong UI card import that includes Bar
  text = text.replace(
    /import\s*\{\s*Bar\s*,\s*CardContent\s*,\s*CardHeader\s*,\s*CardTitle\s*\}\s*from\s*"@\/components\/ui\/card"\s*;?/,
    'import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"'
  )

  // 2) Collect wrong chart imports from react
  const reactImportRe = /import\s*\{([^}]+)\}\s*from\s*"react"\s*;?/g
  let m
  const chartFromReact = new Set()
  let usesUseState = /\buseState\s*\(/.test(text)
  while ((m = reactImportRe.exec(text))) {
    const names = m[1].split(',').map(s => s.trim()).filter(Boolean)
    for (const n of names) {
      if (chartSymsAll.has(n)) chartFromReact.add(n)
      if (n === 'useState') usesUseState = true
    }
  }

  if (chartFromReact.size > 0) {
    // Remove chart symbols from react imports, keep useState if present
    text = text.replace(reactImportRe, (_full, inner) => {
      const kept = inner.split(',').map(s => s.trim()).filter(Boolean).filter(n => n === 'useState')
      if (kept.length > 0) return `import { ${kept.join(', ')} } from "react"\n`
      return ''
    })
  }

  // 3) Merge with recharts imports (also detect usage from body)
  const rechartsImportRe = /import\s*\{([^}]+)\}\s*from\s*"recharts"\s*;?/g
  const recharts = new Set()
  while ((m = rechartsImportRe.exec(text))) {
    const names = m[1].split(',').map(s => s.trim()).filter(Boolean)
    for (const n of names) recharts.add(n)
  }
  for (const n of chartFromReact) recharts.add(n)
  for (const n of chartSymsAll) if (new RegExp(`\\b${n}\\b`).test(text)) recharts.add(n)
  recharts.delete('Card')

  // Remove lone 'import { Card } from "recharts"'
  text = text.replace(/import\s*\{\s*Card\s*\}\s*from\s*"recharts"\s*;?\n?/g, '')

  // Replace all recharts imports with a single merged one (if any used in file body)
  if (recharts.size > 0) {
    // Filter to only used in file body
    const used = Array.from(recharts).filter(n => new RegExp(`\\b${n}\\b`).test(text))
    const stmt = used.length ? `import { ${used.sort().join(', ')} } from "recharts"\n` : ''
    text = text.replace(rechartsImportRe, '')
    if (stmt) {
      const lines = text.split(/\r?\n/)
      let lastImport = -1
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*import\b/.test(lines[i])) lastImport = i
        else break
      }
      if (lastImport >= 0) {
        lines.splice(lastImport + 1, 0, stmt.trim())
        text = lines.join('\n') + (text.endsWith('\n') ? '' : '\n')
      } else {
        text = stmt + text
      }
    }
  }

  // 5) Ensure UI Card import includes Card if <Card ...> is used
  if (/<\s*Card\b/.test(text)) {
    const uiCardRe = /import\s*\{([^}]+)\}\s*from\s*"@\/components\/ui\/card"\s*;?/m
    if (uiCardRe.test(text)) {
      text = text.replace(uiCardRe, (_f, inner) => {
        const parts = inner.split(',').map(s => s.trim()).filter(Boolean)
        if (!parts.includes('Card')) parts.unshift('Card')
        const unique = Array.from(new Set(parts))
        return `import { ${unique.join(', ')} } from "@/components/ui/card"`
      })
    } else {
      text = `import { Card } from "@/components/ui/card"\n` + text
    }
  }

  // 6) Ensure React hooks imports exist if used
  const needUseState = /\buseState\s*\(/.test(text)
  const needUseEffect = /\buseEffect\s*\(/.test(text)
  if (needUseState || needUseEffect) {
    const reactRe = /import\s*\{([^}]+)\}\s*from\s*"react"\s*;?/m
    if (reactRe.test(text)) {
      text = text.replace(reactRe, (_f, inner) => {
        const parts = inner.split(',').map(s => s.trim()).filter(Boolean)
        if (needUseState && !parts.includes('useState')) parts.push('useState')
        if (needUseEffect && !parts.includes('useEffect')) parts.push('useEffect')
        const unique = Array.from(new Set(parts))
        return `import { ${unique.join(', ')} } from "react"`
      })
    } else {
      const hooks = [needUseState ? 'useState' : null, needUseEffect ? 'useEffect' : null].filter(Boolean).join(', ')
      text = `import { ${hooks} } from "react"\n` + text
    }
  }

  // 4) Ensure useState import exists if used
  if (usesUseState && !/from\s+"react"/.test(text)) {
    text = `import { useState } from "react"\n` + text
  }

  if (text !== orig) {
    writeFileSync(file, text)
    changed++
  }
}

console.log(`[repair-recharts-imports] Updated ${changed} files`)
