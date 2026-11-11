# Sudbury Rowing Club

Website for Sudbury Rowing Club – a pnpm monorepo with three applications and shared packages.

## Getting started

This repository uses a git submodule for the MET Norway weather icon set (`packages/weathericons/vendor` → `metno/weathericons`). Cloning without it leaves that directory empty, which causes the `generate` build step to fail.

**Fresh clone:**

```bash
git clone --recurse-submodules https://github.com/willkerry/sudbury-rowing-club.git
```

**Existing clone that is missing the submodule:**

```bash
git submodule update --init --recursive
```

## Development

```bash
pnpm install   # install all dependencies
pnpm dev       # start all dev servers (web on port 4321)
pnpm test      # run tests
pnpm type-check
pnpm check     # Biome lint + format with auto-fix
```

See [`CLAUDE.md`](.claude/CLAUDE.md) for the full architecture and code-style guide.
