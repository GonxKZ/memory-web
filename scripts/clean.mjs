#!/usr/bin/env node
import { rmSync } from 'node:fs'
for (const p of ['dist', 'logs']) {
  try { rmSync(p, { recursive: true, force: true }); console.log(`[clean] removed ${p}`) } catch {}
}

