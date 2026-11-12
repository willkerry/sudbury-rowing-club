/// <reference types="vite/client" />
import type { MDXContent } from "mdx/types";

const squadModules = import.meta.glob<MDXContent>("/content/squads/*.mdx", {
  import: "default",
});

export const loadSquadContent = (
  slug: string,
): Promise<MDXContent> | undefined =>
  squadModules[`/content/squads/${slug}.mdx`]?.();
