# Design: Migrate shadcn components from Radix UI to Base UI

**Date:** 2026-07-08
**App:** `apps/web`
**Status:** Draft – awaiting user review

## Motivation

Radix UI's maintenance has slowed. We want the web app's UI primitives on an actively
developed library going forward. Base UI (the MUI-team library, imported from
`@base-ui/react`) is the target. This is a genuine, complete migration – `radix-ui`
should be gone from `apps/web/package.json` when we finish.

## Scope

**In scope** – everything in `apps/web` currently on Radix:

Wrapper components in `components/ui/`:
- `tooltip.tsx`
- `avatar.tsx`
- `dialog.tsx`
- `label.tsx`
- `button.tsx` (only the `Slot`/`asChild` composition path)
- `accordion.tsx`
- `dropdown-menu.tsx`

Direct Radix usage in consumers:
- `components/regatta/landing-page/details.tsx` (`Slot`)
- `components/nav/mobile-menu/mobile-menu-section.tsx` (`Accordion`)
- `components/banner/index.tsx` (`Collapsible`)

**Out of scope:**
- `components/ui/select.tsx` – a native `<select>`, never used Radix.
- Any restyle or redesign. Behaviour and appearance must be unchanged.

## Delivery

One branch, all components migrated together. `radix-ui` is removed from
`package.json` only once every call site is off it. Single review.

## Key decisions

1. **`asChild` → `render`, except Button.** Base UI has no `Slot`/`asChild`. Consumers
   move to Base UI's `render` idiom at the few direct sites (avatar image, dialog
   close, table dropdown, details Slot). **Button is the exception:** its `asChild`
   prop is used at ~22 call sites, so we keep `asChild` as a Button-level convenience
   implemented internally with Base UI's `useRender` hook. This is treated as one of
   "our modifications" – zero consumer churn, and Button remains our own wrapper's
   public API.
2. **Take shadcn's Base UI source as the new baseline; re-apply our modifications.**
   Our `components/ui/` files are shadcn components with a known set of local
   modifications – dark mode removed (confirmed: zero `dark:` classes remain in
   `components/ui/`), plus other tweaks. shadcn now ships Base UI variants of its
   components (the `base` / "base-nova" style, depending on `@base-ui/react`). So per
   component this is effectively a **three-way merge**:
   - **base → ours:** diff our current file against the upstream shadcn *Radix*
     source to derive "our modifications" (dark-mode removal + others).
   - **base → Base UI:** shadcn's own Radix-to-Base-UI change is the upstream Base UI
     source.
   - **result:** apply our modifications on top of the upstream Base UI source.

   In practice: pull the upstream shadcn Base UI source for each component, strip its
   dark-mode classes, and re-apply our other local changes. The default `@shadcn`
   registry still resolves to Radix; the Base UI sources come from the `base` style,
   configured at implementation time.
3. **Label uses Base UI's `Label`.** Base UI ships a standalone `Label` component;
   keep the wrapper's existing API.
4. **Pin latest stable Base UI, verify live.** Install the current stable 1.x release
   and cross-check each component's anatomy against live shadcn/Base UI docs before
   wiring. Confirm the exact package name/version at install (beta was
   `@base-ui-components/react`; the 1.x line uses `@base-ui/react`).

## Per-component plan (grouped by risk)

### Low risk – near 1:1
- **avatar.tsx** – `Avatar.Root / Image / Fallback`. Direct map.
- **label.tsx** – swap Radix `Label` for Base UI `Label`. Wrapper API unchanged.
- **tooltip.tsx** – gains `Tooltip.Provider` + `Positioner` + `Popup`
  (+ optional `Arrow`/`Viewport`). Wrapper's public API stays the same; internals
  restructure.

### Medium risk – structural + CSS attribute rename
- **accordion.tsx** + **mobile-menu-section.tsx** – `Accordion.Content` →
  `Accordion.Panel`; `Item`/`Header`/`Trigger` map cleanly.
- **dialog.tsx** – Radix `Overlay` + `Content` → Base UI `Backdrop` + `Viewport` +
  `Popup` (note the additional `Viewport` layer). `Dialog.Close asChild` → `render`.
- **dropdown-menu.tsx** + **table.tsx** – Radix `DropdownMenu` → Base UI `Menu`.
  `align`/`side` move from the content element onto `Menu.Positioner`. All three
  `asChild` sites in `table.tsx` become `render`.
- **banner/index.tsx** (Collapsible) – `Collapsible.Content` → `Collapsible.Panel`.

### High risk – composition primitive
- **button.tsx** – replace `Slot`/`Slottable` with the `useRender` hook. The current
  trailing-icon slot is built on `Slottable`, which Base UI does not have; rework that
  path (likely render the icon as a normal sibling and use `useRender` only for the
  root element). Preserve the cva variants and the existing `asChild` prop's behaviour
  from the consumer's point of view where practical, but consumers move to `render`.
- **details.tsx** – direct `Slot` → `useRender`.

## Cross-cutting: CSS state attributes

Radix exposes element state as `data-state="open|closed"`. Base UI uses `data-open` /
`data-closed`, plus `data-starting-style` / `data-ending-style` for enter/exit
animations. Every Tailwind selector like `data-[state=open]:…` / `data-[state=closed]:…`
in the wrappers, `select.module.css`, or global CSS must be rewritten to the Base UI
attributes. Before declaring done, grep the app for `data-state` and `data-\[state`
and confirm no stale Radix-shaped selectors remain.

## Verification

Type-check and build are necessary but not sufficient for a UI change. The user runs
the dev server (standing preference: do not run `next build` against their live
`next dev`). Claude drives the affected surfaces in the browser and confirms:
- dialog open/close (backdrop, escape, close button)
- dropdown menu in the results table (trigger, alignment, item actions)
- mobile-menu accordion expand/collapse
- banner collapse/expand
- tooltip show/hide
- button rendered as a link (`render`) still styled correctly

Anything that cannot be visually confirmed is called out explicitly rather than
claimed as working.

## Definition of done

- All 7 wrappers + 3 consumers off Radix, using Base UI via the `render` idiom.
- No `data-state` Radix-shaped CSS selectors remain.
- `radix-ui` removed from `apps/web/package.json`; lockfile updated.
- `pnpm type-check` passes; app builds.
- Affected surfaces verified in the browser (or explicitly noted otherwise).
- Appearance and behaviour unchanged from before the migration.
