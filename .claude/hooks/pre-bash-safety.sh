#!/bin/bash
# Hook PreToolUse: blocca comandi pericolosi
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | cut -d'"' -f4)

DANGEROUS=(
  "rm -rf /"
  "DROP TABLE"
  "DROP DATABASE"
  "TRUNCATE"
  "git push --force origin main"
  "git push -f origin main"
)

for pattern in "${DANGEROUS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "🚫 BLOCCATO: $pattern"
    exit 2
  fi
done
exit 0
