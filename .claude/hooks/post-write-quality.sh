#!/bin/bash
# Hook PostToolUse: auto-lint su file TS/Vue appena scritti
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"path":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$FILE_PATH" ]; then exit 0; fi
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.vue && "$FILE_PATH" != *.tsx ]]; then exit 0; fi
if [ ! -f "package.json" ]; then exit 0; fi

echo "🔍 Lint: $FILE_PATH"
if command -v pnpm &> /dev/null; then
  pnpm exec eslint "$FILE_PATH" --fix --quiet 2>/dev/null
fi
exit 0
