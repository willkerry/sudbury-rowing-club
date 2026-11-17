#!/usr/bin/env bash
# Exit 2 is the only PostToolUse status whose stderr reaches Claude.

file=$(jq -r '.tool_input.file_path // empty')
[[ -f $file ]] || exit 0

case $file in
  *.js | *.jsx | *.ts | *.tsx | *.mjs | *.cjs | *.mts | *.cts | *.json | *.jsonc | *.css) ;;
  *) exit 0 ;;
esac

root=$(git -C "$(dirname "$file")" rev-parse --show-toplevel 2>/dev/null)
[[ -x $root/node_modules/.bin/oxlint ]] || root=$CLAUDE_PROJECT_DIR
cd "$root" || exit 0

lint=$(node_modules/.bin/oxlint --fix --no-error-on-unmatched-pattern "$file" 2>&1)
lint_status=$?
format=$(node_modules/.bin/oxfmt --no-error-on-unmatched-pattern "$file" 2>&1)
format_status=$?

if ((lint_status != 0 || format_status != 0)); then
  {
    echo "oxlint --fix / oxfmt left problems in $file:"
    ((lint_status != 0)) && echo "$lint"
    ((format_status != 0)) && echo "$format"
  } >&2
  exit 2
fi
