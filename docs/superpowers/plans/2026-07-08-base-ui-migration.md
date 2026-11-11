# Base UI Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all `apps/web` shadcn UI primitives and their consumers from Radix UI to Base UI, then remove the `radix-ui` dependency.

**Architecture:** Per component, take shadcn's Base UI source as the reference wiring, re-apply our local modifications (dark mode already removed; keep our Tailwind classes, cva variants, and component APIs), and rewrite Radix-shaped state selectors (`data-[state=open]` → Base UI's `data-[open]` / `data-panel-open` etc.). Consumers move to the `render` idiom at the few direct `asChild`/`Slot` sites. Button keeps its `asChild` prop, reimplemented internally with Base UI's `useRender`, so its ~22 call sites are untouched.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Base UI (`@base-ui/react`), class-variance-authority, lucide-react.

## Global Constraints

- **Package manager:** pnpm 8.14.1. Never run global installs. Install into `apps/web`.
- **No behaviour or appearance changes.** This is a like-for-like primitive swap.
- **Punctuation:** en dash (`–`) not em dash in any prose/commit messages (darwin, personal project).
- **Code style (Biome):** semicolons, double quotes, trailing commas; named exports; `for...of` not `forEach`; arrow functions; `T[]` not `Array<T>`; empty line before `return`; no what-comments. Lefthook runs `biome check --write` on commit.
- **Verification per task:** no unit-test infra exists for these presentational primitives, so each task's gate is: `pnpm --filter @sudburyrc/web type-check` passes **and** the specific surface is confirmed in the browser (user runs `next dev`; do not run `next build` against a live dev server). Anything not visually confirmable is stated explicitly.
- **Exact Base UI part/prop names must be cross-checked** against the installed version's source under `node_modules/@base-ui/react` (or shadcn's Base UI component source) before wiring each component — the anatomy in this plan reflects Base UI 1.x docs but pin-exact names win.
- **`select.tsx` is out of scope** (native `<select>`, never used Radix).

## Base UI API reference (validated against 1.x docs)

- **Composition:** no `asChild`/`Slot`. Use the `render` prop (`ReactElement` or `(props, state) => ReactElement`) on any part, or the `useRender({ defaultTagName, render, props })` hook for custom components. Import: `import { useRender } from "@base-ui/react/use-render"`.
- **State data attributes (replace Radix `data-[state=open|closed]`):**
  - Popups (Dialog/Menu/Tooltip/Collapsible Popup/Panel, Backdrop): `data-open`, `data-closed`, `data-starting-style`, `data-ending-style`.
  - Positioner side/align: `data-side` (unchanged token), `data-align`.
  - Accordion Trigger: `data-panel-open`. Accordion Panel: `data-open` + `data-starting-style`/`data-ending-style`.
  - Menu SubmenuTrigger open: `data-popup-open`.
- **Accordion.Root:** `multiple` (default `false` = single), `value`/`defaultValue` are arrays, `onValueChange`. Radix `type="single" collapsible` → just default single mode (all-closed allowed by default). Anatomy: `Root > Item(value) > Header > Trigger`, `Item > Panel`.
- **Accordion animation:** Base UI exposes the panel height as `--accordion-panel-height` (Radix used `--radix-accordion-content-height`). Tailwind keyframes must be updated.
- **Dialog:** `Root(open,onOpenChange) > Portal > Backdrop + Popup > Title/Description/Close`. `Close` has `render` + `nativeButton` (keep default `true` when rendering our `<button>`-based Button). We keep our manual fixed-centre positioning on `Popup` (no `Viewport` part needed).
- **Menu:** `Root > Trigger > Portal > Positioner(side,align,sideOffset) > Popup > Item/CheckboxItem/RadioItem/Separator/Group/GroupLabel`. Radix `Content`'s `align`/`sideOffset` move onto `Positioner`. `ItemIndicator` → `CheckboxItemIndicator`/`RadioItemIndicator`.
- **Tooltip:** `Provider(delay) > Root > Trigger > Portal > Positioner(sideOffset) > Popup`.
- **Collapsible:** `Root(open,onOpenChange) > Trigger > Panel`.
- **Avatar:** `Root > Image + Fallback` (1:1 with Radix). `Image` supports `render`.
- **Label:** Base UI 1.6.0 has **no standalone `Label`** (verified against the installed package — only `Field`/`Field.Label`). Our `Label` is used standalone with `htmlFor`, so it becomes a plain styled `<label>` element keeping the exact same component API. `mergeProps` and `useRender` are available from `@base-ui/react/merge-props` and `@base-ui/react/use-render`.
- **Verified installed API (`@base-ui/react@1.6.0`):** Accordion `{Header, Item, Panel, Root, Trigger}`; Menu `{Root, Trigger, Portal, Positioner, Popup, Item, CheckboxItem, CheckboxItemIndicator, RadioItem, RadioItemIndicator, RadioGroup, Group, GroupLabel, Separator, SubmenuRoot, SubmenuTrigger, Arrow, Backdrop, Viewport, LinkItem}`; Dialog `{Root, Trigger, Portal, Backdrop, Popup, Title, Description, Close, Viewport}`; Collapsible `{Root, Trigger, Panel}`; Tooltip `{Provider, Root, Trigger, Portal, Positioner, Popup, Arrow, Viewport}`; Avatar `{Root, Image, Fallback}`; accordion panel height CSS var `--accordion-panel-height`.

---

## Task 0: Branch + install Base UI + configure registry

**Files:**
- Modify: `apps/web/package.json` (add `@base-ui/react`)
- Modify: `apps/web/components.json` (register the shadcn Base UI style/registry, if used for pulling reference sources)

- [ ] **Step 1: Create the migration branch**

```bash
git checkout -b migrate/base-ui
```

- [ ] **Step 2: Confirm the exact Base UI package name + latest stable, then install into apps/web**

Check the current published name (the 1.x line is `@base-ui/react`; the old beta was `@base-ui-components/react`):

```bash
pnpm --filter @sudburyrc/web add @base-ui/react
```

If that 404s, fall back to `@base-ui-components/react` and adjust all import paths in this plan accordingly.

- [ ] **Step 3: Verify install and imports resolve**

```bash
ls apps/web/node_modules/@base-ui/react
node -e "require.resolve('@base-ui/react/use-render')" 2>/dev/null && echo OK || echo "check subpath"
```

Expected: the package directory exists.

- [ ] **Step 4: Baseline type-check (pre-migration, still on Radix)**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS (establishes a clean baseline; radix-ui still present).

- [ ] **Step 5: Commit**

```bash
git add apps/web/package.json ../../pnpm-lock.yaml apps/web/components.json
git commit -m "chore(web): add Base UI dependency for Radix migration"
```

---

## Task 1: Avatar (`avatar.tsx` + `contact/identity.tsx`)

Lowest risk, validates the Base UI wiring + `render` idiom end to end.

**Files:**
- Modify: `apps/web/components/ui/avatar.tsx`
- Modify: `apps/web/components/contact/identity.tsx` (`AvatarImage asChild` → `render`)

**Interfaces:**
- Produces: `Avatar`, `AvatarImage`, `AvatarFallback` — same names/exports as today; `AvatarImage` accepts a `render` prop (Base UI) instead of `asChild`.

- [ ] **Step 1: Rewrite `avatar.tsx` onto Base UI**

```tsx
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "lib/utils";
import { forwardRef } from "react";

const Avatar = forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    className={cn("aspect-square h-full w-full", className)}
    ref={ref}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full",
      className,
    )}
    ref={ref}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarFallback, AvatarImage };
```

- [ ] **Step 2: Update `contact/identity.tsx` to use `render` instead of `asChild`**

Replace the `AvatarImage` block (currently `<AvatarImage asChild ...><Image .../></AvatarImage>`) with:

```tsx
return (
  <AvatarImage
    ref={ref}
    render={
      <Image alt="" {...imageProps} blurDataURL={lqip} placeholder="blur" />
    }
    src={imageProps.src}
    {...props}
  />
);
```

Note: `src` is still passed for Base UI's load-state tracking; the actual rendered element is the Next `<Image>`. Confirm against Base UI `Avatar.Image` docs that `render` + `src` coexist; if `src` is rejected, drop it and rely on the Image's own `src`.

- [ ] **Step 3: Type-check**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS.

- [ ] **Step 4: Browser-verify**

On a page rendering `Identity` (contact/committee pages), confirm: image loads, fallback shows when image missing, sizing/rounding unchanged.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/ui/avatar.tsx apps/web/components/contact/identity.tsx
git commit -m "refactor(web): migrate Avatar to Base UI"
```

---

## Task 2: Label (`label.tsx`)

**Files:**
- Modify: `apps/web/components/ui/label.tsx`

**Interfaces:**
- Produces: `Label` — same export, same props (`required`, `className`, standard label attrs).

**Context:** Base UI 1.6.0 has no standalone `Label` primitive (verified against the installed package). Radix's `Label` only added double-click text-selection prevention, which is negligible here. So `Label` becomes a plain styled `<label>` element — same public API, no Base UI import needed. This is the correct like-for-like given the installed API; do not pull in `Field` (our `Label` is used standalone, not inside a `Field.Root`).

- [ ] **Step 1: Rewrite `label.tsx` as a plain styled label**

```tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const RequiredIndicator = () => (
  <span className="absolute inset-y-0 -left-3.5 flex items-center text-red-600">
    <span aria-hidden>＊</span>
    <span className="sr-only">(Required)</span>
  </span>
);

type LabelProps = React.ComponentPropsWithoutRef<"label"> &
  VariantProps<typeof labelVariants> & {
    required?: boolean;
  };

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor / wrapping is supplied by consumers
    <label
      className={cn(labelVariants(), "relative", className)}
      ref={ref}
      {...props}
    >
      {children}
      {required && <RequiredIndicator />}
    </label>
  ),
);
Label.displayName = "Label";

export { Label };
```

Note: if Biome does not flag `noLabelWithoutControl`, drop the `biome-ignore` line (it must not be a no-op comment). Run `pnpm --filter @sudburyrc/web check` on this file to confirm whether the suppression is needed before committing.

- [ ] **Step 2: Type-check**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS.

- [ ] **Step 3: Browser-verify**

On a form using `Label` (e.g. contact form), confirm the label renders, clicking it focuses its input (`htmlFor`), and the required asterisk appears when `required` is set.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/ui/label.tsx
git commit -m "refactor(web): migrate Label to Base UI"
```

---

## Task 3: Tooltip (`tooltip.tsx`)

**Files:**
- Modify: `apps/web/components/ui/tooltip.tsx`

**Interfaces:**
- Produces: `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` — same export names. `TooltipContent` now renders the Base UI `Portal > Positioner > Popup` internally; consumers keep using `<TooltipContent sideOffset={n} className=...>`.

- [ ] **Step 1: Rewrite `tooltip.tsx` onto Base UI**

```tsx
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup> & {
    sideOffset?: number;
  }
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner sideOffset={sideOffset}>
      <TooltipPrimitive.Popup
        className={cn(
          "not-prose fade-in-0 zoom-in-95 data-[closed]:fade-out-0 data-[closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 animate-in overflow-hidden rounded-md border border-gray-200 bg-white px-3 py-1.5 text-gray-950 text-sm shadow-md data-[closed]:animate-out",
          className,
        )}
        ref={ref}
        {...props}
      />
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = "TooltipContent";
```

Changes from Radix: added `Portal` + `Positioner` wrappers; `sideOffset` moved to `Positioner`; `data-[state=closed]` → `data-[closed]`.

- [ ] **Step 2: Type-check**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS.

- [ ] **Step 3: Browser-verify**

Find a `TooltipTrigger`/`TooltipContent` usage (grep `TooltipTrigger`), hover the trigger, confirm the tooltip appears on the correct side with the same styling and dismisses on blur. Confirm a `TooltipProvider` wraps the app/tree (Base UI requires it) — if a Radix `TooltipProvider` was present, it maps 1:1.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/ui/tooltip.tsx
git commit -m "refactor(web): migrate Tooltip to Base UI"
```

---

## Task 4: Accordion (`accordion.tsx` + `mobile-menu-section.tsx` + `collapsible-card.tsx` + tailwind keyframes)

**Files:**
- Modify: `apps/web/components/ui/accordion.tsx`
- Modify: `apps/web/components/nav/mobile-menu/mobile-menu-section.tsx` (direct Radix Accordion)
- Modify: `apps/web/components/stour/collapsible-card/collapsible-card.tsx` (Radix-shaped selector on `AccordionTrigger`)
- Modify: `apps/web/tailwind.config.js` (accordion keyframes CSS var)

**Interfaces:**
- Produces: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` — same export names. `AccordionContent` wraps Base UI `Accordion.Panel`.

- [ ] **Step 1: Rewrite `accordion.tsx` onto Base UI**

```tsx
"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";

const Accordion = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    className={cn("divide-y rounded-sm border", className)}
    ref={ref}
    {...props}
  />
));
Accordion.displayName = "Accordion";

const AccordionItem = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item className={cn(className)} ref={ref} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        "flex flex-1 items-center justify-between p-4 font-medium text-gray-600 transition-all hover:text-black [&[data-panel-open]>svg]:rotate-180",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Panel>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Panel
    className="overflow-hidden text-sm transition-all data-[closed]:animate-accordion-up data-[open]:animate-accordion-down"
    ref={ref}
    {...props}
  >
    <div className={cn("px-4 pt-0 pb-4", className)}>{children}</div>
  </AccordionPrimitive.Panel>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
```

Changes: `Content` → `Panel`; trigger `data-[state=open]` → `data-[panel-open]`; panel `data-[state=closed|open]` → `data-[closed|open]`.

- [ ] **Step 2: Update tailwind accordion keyframes to Base UI's CSS var**

In `apps/web/tailwind.config.js`, change both occurrences of `var(--radix-accordion-content-height)` to `var(--accordion-panel-height)`:

```js
"accordion-down": {
  from: { height: "0" },
  to: { height: "var(--accordion-panel-height)" },
},
"accordion-up": {
  from: { height: "var(--accordion-panel-height)" },
  to: { height: "0" },
},
```

Confirm the exact var name against Base UI's accordion source (`node_modules/@base-ui/react/.../accordion`); some versions expose `--accordion-panel-height` on the Panel element.

- [ ] **Step 3: Migrate `mobile-menu-section.tsx` (direct Radix Accordion)**

Replace `import { Accordion } from "radix-ui";` with `import { Accordion } from "@base-ui/react/accordion";`, then:
- `<Accordion.Root collapsible type="single">` → `<Accordion.Root>` (single is default; all-closed allowed by default).
- `<Accordion.Item className={outer} value={title}>` → unchanged (Base UI `Item` takes `value`).
- Wrap the trigger in `<Accordion.Header>` and change the selector `[&[data-state=open]>svg]:-rotate-180` → `[&[data-panel-open]>svg]:-rotate-180`.
- `<Accordion.Content>` → `<Accordion.Panel>`; change `data-[state=closed]:...`/`data-[state=open]:...` → `data-[closed]:...`/`data-[open]:...`.

Resulting `collapse` branch:

```tsx
if (collapse)
  return (
    <Accordion.Root>
      <Accordion.Item className={outer} value={title}>
        <Accordion.Header>
          <Accordion.Trigger
            className={cn(
              titleClasses,
              "-my-4 flex w-full justify-between py-4 [&[data-panel-open]>svg]:-rotate-180",
            )}
          >
            {title}
            <ChevronDownIcon
              aria-hidden
              className="h-4 w-4 transition-transform duration-200"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel
          className={cn(
            panel,
            "transition-all data-[closed]:animate-accordion-up data-[open]:animate-accordion-down data-[closed]:opacity-0 data-[open]:opacity-100",
          )}
        >
          {inner}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
```

- [ ] **Step 4: Migrate `collapsible-card.tsx` selector**

Change the `AccordionTrigger` class `data-[state=open]:bg-gray-50` → `data-[panel-open]:bg-gray-50`. (It consumes our `AccordionTrigger`, which forwards `className` to the Base UI trigger, so the trigger's `data-panel-open` applies.)

- [ ] **Step 5: Type-check**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS.

- [ ] **Step 6: Browser-verify**

- Accordion component: expand/collapse animates with the same height slide, chevron rotates, `collapsible-card` header background changes when open.
- Mobile menu: open the mobile nav, expand a collapsible section, confirm the chevron rotation, open/close animation, and opacity transition match previous behaviour.

- [ ] **Step 7: Commit**

```bash
git add apps/web/components/ui/accordion.tsx apps/web/components/nav/mobile-menu/mobile-menu-section.tsx apps/web/components/stour/collapsible-card/collapsible-card.tsx apps/web/tailwind.config.js
git commit -m "refactor(web): migrate Accordion to Base UI"
```

---

## Task 5: Collapsible (`banner/index.tsx`)

**Files:**
- Modify: `apps/web/components/banner/index.tsx`

**Interfaces:**
- Consumes: nothing new. Produces: no exported UI primitive (Collapsible is used inline here only).

- [ ] **Step 1: Swap the import and parts**

Replace `import { Collapsible } from "radix-ui";` with `import { Collapsible } from "@base-ui/react/collapsible";`.

Update the `ButtonOrAnchor` prop type: `Collapsible.CollapsibleTriggerProps` → the Base UI trigger props type. Use `React.ComponentPropsWithoutRef<typeof Collapsible.Trigger>`:

```tsx
const ButtonOrAnchor = (
  props:
    | ({ type: "button" } & React.ComponentPropsWithoutRef<
        typeof Collapsible.Trigger
      >)
    | ({ type: "a" } & LinkProps),
) => {
  if (props.type === "button") {
    const { type: _, ...buttonProps } = props;

    return <Collapsible.Trigger {...buttonProps} />;
  }

  const { type: _, ...anchorProps } = props;

  return <Link rel="noopener noreferrer" target="_blank" {...anchorProps} />;
};
```

- [ ] **Step 2: `Collapsible.Content` → `Collapsible.Panel`**

Change the `<Collapsible.Content className="absolute z-40 ...">` element to `<Collapsible.Panel className="absolute z-40 ...">` (and its closing tag). The className has no `data-[state]` selectors, so no selector rewrite is needed here. `Collapsible.Root` keeps `open`/`onOpenChange`/`ref` unchanged.

- [ ] **Step 3: Type-check**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS.

- [ ] **Step 4: Browser-verify**

Trigger a notice banner without a link (so the collapsible panel renders). Confirm: clicking the banner expands/collapses the panel, click-outside and scroll-past-100px collapse it, focus-out collapses it. The banner requires live tRPC notice data — if none is available locally, state that this could not be visually confirmed and rely on type-check.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/banner/index.tsx
git commit -m "refactor(web): migrate Banner collapsible to Base UI"
```

---

## Task 6: Dialog (`dialog.tsx`)

**Files:**
- Modify: `apps/web/components/ui/dialog.tsx`

**Interfaces:**
- Consumes: `Button` (unchanged, still Radix-free after Task 8; here Button is used as a child of `Dialog.Close render`). Produces: `DialogProvider`, `Dialog` (imperative API), `useInitializeDialog` — all unchanged public API. Only `DialogComponent`'s internals change.

- [ ] **Step 1: Swap import and the render tree**

Replace `import { Dialog as RadixDialog } from "radix-ui";` with `import { Dialog as BaseDialog } from "@base-ui/react/dialog";`.

Rewrite the returned tree in `DialogComponent` (the imperative context API and everything else stays identical):

```tsx
return (
  <BaseDialog.Root onOpenChange={() => closeDialog()} open={isOpen}>
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="data-[closed]:fade-out-0 data-[open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[closed]:animate-out data-[open]:animate-in" />

      <BaseDialog.Popup className="data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[closed]:slide-out-to-left-1/2 data-[closed]:slide-out-to-top-[48%] data-[open]:slide-in-from-left-1/2 data-[open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] overflow-hidden border bg-gray-50 p-3 shadow-lg duration-200 data-[closed]:animate-out data-[open]:animate-in sm:rounded-sm">
        {title && (
          <BaseDialog.Title className="font-semibold text-gray-780 text-sm">
            {title}
          </BaseDialog.Title>
        )}

        <BaseDialog.Description className="font-medium text-gray-600 text-sm">
          {description}
        </BaseDialog.Description>

        <div className="-mx-0.5 mt-4 -mb-0.5 flex justify-between">
          <BaseDialog.Close
            className="flex-1"
            onClick={onClose}
            render={
              <Button size="xs" variant="secondary">
                {closeText}
              </Button>
            }
          />

          {onConfirm && (
            <Button
              className="flex-1"
              onClick={() => {
                onConfirm();
                closeDialog();
              }}
              size="sm"
            >
              {confirmText}
            </Button>
          )}
        </div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  </BaseDialog.Root>
);
```

Changes: `Overlay` → `Backdrop`; `Content` → `Popup`; all `data-[state=open|closed]` → `data-[open|closed]`; `Close asChild` (child Button) → `Close render={<Button .../>}`. Note `Dialog.Close` defaults `nativeButton` to `true`, which matches our Button's `<button>` root — keep the default.

- [ ] **Step 2: Update the stale comment**

Change the `// The actual dialog component using Radix UI` comment to remove the Radix reference (or delete it — per style, prefer no what-comment).

- [ ] **Step 3: Type-check**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS.

- [ ] **Step 4: Browser-verify**

Trigger a dialog (e.g. call `Dialog.error(...)` from a dev affordance, or a page that uses it). Confirm: backdrop appears, dialog is centred, open/close animations play, the Close button (rendered as our secondary Button) closes it and fires `onClose`, Escape and backdrop-click close it, and the confirm button works. If no in-app trigger is easily reachable, state that and rely on type-check + a temporary local trigger.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/ui/dialog.tsx
git commit -m "refactor(web): migrate Dialog to Base UI"
```

---

## Task 7: Dropdown Menu (`dropdown-menu.tsx` + `table.tsx`)

Highest-risk consumer task: the table filter renders an `<Input>` inside the menu.

**Files:**
- Modify: `apps/web/components/ui/dropdown-menu.tsx`
- Modify: `apps/web/components/ui/table.tsx` (`DataTableColumnHeader`)

**Interfaces:**
- Produces: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuGroup`, `DropdownMenuPortal`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuRadioGroup` — same export names. `DropdownMenuContent` now internally renders `Portal > Positioner > Popup` and accepts `align`/`side`/`sideOffset` (forwarded to `Positioner`).

- [ ] **Step 1: Rewrite `dropdown-menu.tsx` onto Base UI Menu**

Key mappings: `DropdownMenuPrimitive` → `Menu` (`@base-ui/react/menu`); `Root/Trigger/Portal/Group/RadioGroup` map directly; `Sub` → `SubmenuRoot`; `SubTrigger` → `SubmenuTrigger`; `SubContent` → nested `Positioner > Popup`; `Content`'s `align`/`sideOffset` move to `Positioner`; `ItemIndicator` → `CheckboxItemIndicator` / `RadioItemIndicator`; `data-[state=open]` on submenu trigger → `data-[popup-open]`; item `data-disabled` unchanged (Base UI Menu.Item also exposes `data-disabled`).

```tsx
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const DropdownMenu = MenuPrimitive.Root;

const DropdownMenuTrigger = MenuPrimitive.Trigger;

const DropdownMenuGroup = MenuPrimitive.Group;

const DropdownMenuPortal = MenuPrimitive.Portal;

const DropdownMenuSub = MenuPrimitive.SubmenuRoot;

const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = forwardRef<
  React.ComponentRef<typeof MenuPrimitive.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubmenuTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenuPrimitive.SubmenuTrigger
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-xs px-2 py-1.5 text-sm outline-hidden focus:bg-gray-100 data-[popup-open]:bg-gray-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    ref={ref}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </MenuPrimitive.SubmenuTrigger>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner>
      <MenuPrimitive.Popup
        className={cn(
          "data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-lg data-[closed]:animate-out data-[open]:animate-in",
          className,
        )}
        ref={ref}
        {...props}
      />
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

const DropdownMenuContent = forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup> & {
    align?: "start" | "center" | "end";
    side?: "top" | "bottom" | "left" | "right";
    sideOffset?: number;
  }
>(({ className, align = "center", side, sideOffset = 4, ...props }, ref) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner align={align} side={side} sideOffset={sideOffset}>
      <MenuPrimitive.Popup
        className={cn(
          "data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md data-[closed]:animate-out data-[open]:animate-in",
          className,
        )}
        ref={ref}
        {...props}
      />
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.Item
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-xs px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-gray-100 focus:text-gray-900 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    ref={ref}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = forwardRef<
  React.ComponentRef<typeof MenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem
    checked={checked}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden transition-colors focus:bg-gray-100 focus:text-gray-900 data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenuPrimitive.CheckboxItemIndicator>
        <Check className="h-4 w-4" />
      </MenuPrimitive.CheckboxItemIndicator>
    </span>
    {children}
  </MenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = forwardRef<
  React.ComponentRef<typeof MenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.RadioItem
    className={cn(
      "relative flex cursor-default select-none items-center rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden transition-colors focus:bg-gray-100 focus:text-gray-900 data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenuPrimitive.RadioItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenuPrimitive.RadioItemIndicator>
    </span>
    {children}
  </MenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = forwardRef<
  React.ComponentRef<typeof MenuPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.GroupLabel> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.GroupLabel
    className={cn(
      "px-2 py-1.5 font-semibold text-sm",
      inset && "pl-8",
      className,
    )}
    ref={ref}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-gray-100", className)}
    ref={ref}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    {...props}
  />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
```

Notes to verify against installed source: `DropdownMenuLabel` was Radix `Menu.Label`; Base UI groups labels under `Menu.GroupLabel`. If a standalone label without a group misbehaves, wrap usages in `DropdownMenuGroup` or keep a plain styled `<div role="presentation">`. `GroupLabel` is only reached via `DropdownMenuLabel`, which is not currently used in `table.tsx`, so any residual risk is low.

- [ ] **Step 2: Update `table.tsx` trigger sites (`asChild` → `render`)**

The two sort/filter triggers use `<DropdownMenuTrigger asChild><Button …>…</Button></DropdownMenuTrigger>`. Convert to `render`:

```tsx
<DropdownMenuTrigger
  render={
    <Button
      className="px-1"
      size="xs"
      variant={column.getIsSorted() ? "tertiary" : "ghost"}
    />
  }
>
  {sortIcon}
  <span className="sr-only">Sort</span>
</DropdownMenuTrigger>
```

Apply the same shape to the filter trigger (second block, `variant={column.getIsFiltered() ? "tertiary" : "ghost"}`, child `<Search/>` + sr-only span). The trigger's children (icon + sr-only text) become the `Menu.Trigger` children; the Button is supplied via `render` and receives the trigger's props/ref.

- [ ] **Step 3: Rework the filter-input-in-menu block**

The current filter menu nests `DropdownMenuContent asChild > DropdownMenuItem asChild > Input`. A Base UI `Menu.Item` applies menuitem semantics and typeahead that break a text input. Instead, render the `Input` directly inside the popup (no `Item`), and stop keydown propagation so the menu's typeahead/navigation does not hijack typing:

```tsx
<DropdownMenuContent align="start">
  <Input
    aria-label={`Filter by ${title}`}
    onChange={(event) => column.setFilterValue(event.target.value)}
    onKeyDown={(event) => event.stopPropagation()}
    type="text"
    value={String(column.getFilterValue() ?? "")}
  />
</DropdownMenuContent>
```

Remove the now-unused `asChild` props. Confirm in the browser that focus lands in the input when the menu opens and typing filters the column. If Base UI's Menu still steals focus/keys, wrap the input in `<Menu.Item render={<Input … />} closeOnClick={false} />` as a fallback and re-test.

- [ ] **Step 4: Type-check**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS.

- [ ] **Step 5: Browser-verify (results/records data table)**

On a page with a sortable/filterable data table (`app/regatta/records/...`):
- Open the sort menu: alignment `start`, items trigger asc/desc/clear, disabled states correct.
- Open the filter menu: the input is focusable, typing filters rows, the menu stays open while typing, and clicking outside closes it.
- Confirm popup styling/animation unchanged.

- [ ] **Step 6: Commit**

```bash
git add apps/web/components/ui/dropdown-menu.tsx apps/web/components/ui/table.tsx
git commit -m "refactor(web): migrate DropdownMenu to Base UI"
```

---

## Task 8: Button (`button.tsx`) — keep `asChild` via `useRender`

**Files:**
- Modify: `apps/web/components/ui/button.tsx`

**Interfaces:**
- Consumes: `useRender` from `@base-ui/react/use-render`. Produces: `Button`, `buttonVariants` — **unchanged public API** (`asChild`, `icon`, `loading`, `variant`, `size`, `shadow`, standard button attrs). No consumer changes.

- [ ] **Step 1: Reimplement Button with `useRender`, preserving `asChild` + trailing icon**

The trailing icon/loader must always render after the label, and `asChild` must merge props onto a caller-supplied element (Radix `Slottable` is not available). Compose the inner content, then use `useRender` with `render` when `asChild` is set:

```tsx
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

const buttonVariants = cva(
  "not-prose relative inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium text-sm ring-offset-white transition-[color,background-color,box-shadow,transform] duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      shadow: {
        true: "shadow-xl transition-shadow hover:shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        icon: "h-10 w-10",
        lg: "h-11 px-8",
        sm: "h-9 px-3",
        xs: "h-7 px-2 font-medium text-xs",
      },
      variant: {
        brand: "bg-blue-700 text-white hover:bg-blue-500",
        default: "bg-black text-gray-100 hover:bg-black/80",
        destructive: "bg-red-600 text-white hover:bg-red-500",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-gray-900 underline-offset-4 hover:underline",
        secondary: "border bg-white text-gray-900 hover:bg-gray-100",
        success: "bg-green-600 text-white hover:bg-green-500",
        tertiary: "border bg-gray-100 text-gray-900 hover:bg-gray-200",
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      shadow,
      size,
      asChild = false,
      icon,
      loading,
      children,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {children}
        <span aria-hidden className="ml-2 w-4">
          {loading ? <Loader2 className="animate-spin" /> : icon}
        </span>
      </>
    );

    const element = useRender({
      defaultTagName: "button",
      render: asChild ? undefined : <button type="button" />,
      props: {
        className: cn(buttonVariants({ variant, size, className, shadow })),
        disabled: loading,
        ref,
        ...props,
        children: content,
      },
    });

    return element;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Important asChild-composition caveat:** with Radix `Slot`, `asChild` merged Button's props onto the caller's child (e.g. `<Link>`) while keeping that child's own children, and the trailing icon was injected as a sibling via `Slottable`. `useRender` merges props onto a *render element*, not onto `children`. So the above shape works for the non-`asChild` case, but the `asChild` case (caller passes a `<Link>` as `children`) needs the caller element promoted to the `render` target. Two acceptable implementations — pick the one that type-checks and preserves behaviour, verified against the 22 call sites:

Option A (recommended) — when `asChild`, treat the single child element as the render target and re-inject its children + trailing icon:

```tsx
import { Children, cloneElement, isValidElement } from "react";
// ...
if (asChild && isValidElement(children)) {
  const child = children as React.ReactElement<{ children?: React.ReactNode }>;
  return useRender({
    defaultTagName: "button",
    render: child,
    props: {
      className: cn(buttonVariants({ variant, size, className, shadow })),
      ...props,
      children: (
        <>
          {child.props.children}
          <span aria-hidden className="ml-2 w-4">
            {loading ? <Loader2 className="animate-spin" /> : icon}
          </span>
        </>
      ),
    },
  });
}
```
(and the non-asChild branch as in the first snippet, rendering a real `<button>`).

Option B — if Base UI ships a `mergeProps`/`Slot`-like helper in the installed version, use it; verify by inspecting `node_modules/@base-ui/react`.

Do not call `useRender` conditionally in a way that violates the Rules of Hooks — compute a single `renderElement` value and branch on the inputs to `useRender`, calling the hook exactly once per render. Refactor the two snippets above into one `useRender` call whose `render` and `props.children` are chosen by `asChild` before the call.

- [ ] **Step 2: Type-check**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS.

- [ ] **Step 3: Browser-verify a representative spread of call sites**

- Plain button: `app/regatta/draw/client.tsx` live button (icon + label).
- `asChild` with `<Link>`: `app/not-found.tsx` / `app/error.tsx` "Home" button (icon renders after label, link navigates, styling intact).
- `asChild` with `<a download>`: `app/regatta/course/page.tsx` download button.
- `loading` state: any form submit button — spinner replaces icon, button disabled.
- Confirm focus ring, hover, and `active:translate-y-px` still apply on both `<button>` and `asChild` link renders.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/ui/button.tsx
git commit -m "refactor(web): migrate Button asChild to Base UI useRender"
```

---

## Task 9: Details Slot (`regatta/landing-page/details.tsx`)

**Files:**
- Modify: `apps/web/components/regatta/landing-page/details.tsx`

**Interfaces:**
- Consumes: `useRender` from `@base-ui/react/use-render`. Produces: `Details`, `DetailProps` — unchanged.

- [ ] **Step 1: Replace `Slot.Slot` with a small `useRender`-based wrapper**

`Slot.Slot` here merges the icon-styling className/`aria-hidden` onto the caller-provided `icon` element. Replace the `radix-ui` `Slot` import with a tiny local component using `useRender`:

```tsx
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useRender } from "@base-ui/react/use-render";
import Link from "next/link";
import { cn } from "@/lib/utils";

const StyledIcon = ({
  render,
  className,
}: {
  render: React.ReactElement;
  className: string;
}) => useRender({ render, props: { className, "aria-hidden": true } });
```

Then in the map body, replace the `<Slot.Slot …>{icon}</Slot.Slot>` block with:

```tsx
<StyledIcon
  className="h-6 w-6 stroke-[1.5px] text-gray-400 transition-colors group-hover:text-blue-600 group-focus:text-blue-600"
  render={icon as React.ReactElement}
/>
```

`icon` is a `React.ReactNode`; the call sites pass an SVG element, so casting to `ReactElement` is safe. If any caller passes a non-element, guard with `isValidElement`.

- [ ] **Step 2: Type-check**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS.

- [ ] **Step 3: Browser-verify**

On the regatta landing page, confirm each detail row's icon shows with the grey→blue hover/focus colour transition and correct sizing, and the row link still navigates.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/regatta/landing-page/details.tsx
git commit -m "refactor(web): migrate Details Slot to Base UI useRender"
```

---

## Task 10: Remove Radix + final sweep

**Files:**
- Modify: `apps/web/package.json` (remove `radix-ui`)

- [ ] **Step 1: Confirm no remaining Radix imports or Radix-shaped selectors**

```bash
grep -rn "radix-ui\|@radix" apps/web/components apps/web/app 2>/dev/null | grep -v node_modules
grep -rn "data-\[state\|--radix-" apps/web/components apps/web/app apps/web/styles apps/web/tailwind.config.js 2>/dev/null | grep -v node_modules
```

Expected: **no output** from both. Any hit must be fixed before proceeding (a residual `data-[state=...]` selector will silently no-op under Base UI).

- [ ] **Step 2: Remove the dependency**

```bash
pnpm --filter @sudburyrc/web remove radix-ui
```

- [ ] **Step 3: Full type-check**

```bash
pnpm --filter @sudburyrc/web type-check
```

Expected: PASS.

- [ ] **Step 4: Production build sanity (only if no `next dev` is running against this checkout)**

```bash
pnpm --filter @sudburyrc/web build
```

Expected: build completes. If the user has a live `next dev`, skip this and note it.

- [ ] **Step 5: Final browser regression sweep**

Re-check each migrated surface once more in a single pass: avatar, label/form, tooltip, accordion (component + mobile menu + collapsible card), banner, dialog, dropdown (sort + filter), button (plain + asChild + loading), details icons. Note anything not visually confirmable.

- [ ] **Step 6: Commit**

```bash
git add apps/web/package.json ../../pnpm-lock.yaml
git commit -m "chore(web): remove radix-ui after Base UI migration"
```

---

## Self-review notes

- **Spec coverage:** every in-scope file from the spec maps to a task — avatar (T1), label (T2), tooltip (T3), accordion + its 2 consumers + keyframes (T4), collapsible/banner (T5), dialog (T6), dropdown + table (T7), button (T8), details (T9), radix removal + CSS sweep (T10). `select.tsx` correctly excluded.
- **asChild handling:** Button keeps `asChild` (T8, `useRender`, 0 consumer edits); render idiom applied at avatar image (T1), dialog close (T6), table triggers/filter (T7), details (T9) — matches the amended spec decision.
- **CSS attribute rewrite:** `data-[state=open|closed]` → `data-[open|closed]`; accordion trigger → `data-[panel-open]`; submenu trigger → `data-[popup-open]`; `--radix-accordion-content-height` → `--accordion-panel-height`. Final sweep in T10 enforces zero residuals.
- **Known risk flagged for the implementer:** exact Base UI part/prop/export names (`Label` vs `Label.Root`, `GroupLabel`, `useRender` subpath, the accordion panel CSS var, `Avatar.Image` `render`+`src`) must be confirmed against the installed package — every task says so at the point it matters.
- **Rules of Hooks:** T8 explicitly calls out that `useRender` must be called exactly once per render regardless of `asChild`.
