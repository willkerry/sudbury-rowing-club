#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

DIRECTORIES=(
    "$DIR"/../apps
    "$DIR"/../packages
)

for d in "${DIRECTORIES[@]}"; do
    (
        cd "$d" || exit
        for do in */; do
            (cd "$do" && pnpm upgrade)
        done
    )
done

echo "All workspaces have been upgraded"
