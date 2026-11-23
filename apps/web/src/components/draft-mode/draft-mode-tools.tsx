"use client";

import type { VisualEditing as VisualEditingComponent } from "@sanity/visual-editing/react";
import { useRouter } from "next/navigation";
import { type ComponentProps, type ComponentType, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";

// Loaded only in draft mode, so public visitors never download it; the SSR
// guard keeps it out of the Worker bundle (it only renders in the browser).
const VisualEditing = lazy<
  ComponentType<ComponentProps<typeof VisualEditingComponent>>
>(() =>
  import.meta.env.SSR
    ? Promise.resolve({ default: () => null })
    : import("@sanity/visual-editing/react").then((module) => ({
        default: module.VisualEditing,
      })),
);

export const DraftModeTools = () => {
  const router = useRouter();

  const refresh = () => {
    router.refresh();

    return Promise.resolve();
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-sm border bg-white px-3 py-2 text-sm shadow-xl">
        <p role="status">You’re viewing unpublished drafts.</p>
        <Button asChild size="xs" variant="secondary">
          <a href="/api/draft-mode/disable">Exit draft mode</a>
        </Button>
      </div>

      <Suspense fallback={null}>
        <VisualEditing portal refresh={refresh} />
      </Suspense>
    </>
  );
};
