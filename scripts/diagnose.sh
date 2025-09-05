#!/bin/bash
set -euo pipefail

# Diagnóstico rápido local (sin npm install)
echo "[diagnose] Compilando (build)…"
npm run -s build

echo "[diagnose] Typecheck…"
npm run -s typecheck

echo "[diagnose] OK"
