/// <reference types="vite/client" />
import type { MDXContent } from "mdx/types";

const policyModules = import.meta.glob<MDXContent>(
  "/content/policies/**/*.mdx",
  { import: "default" },
);

export const loadPolicyContent = (
  path: string,
): Promise<MDXContent> | undefined =>
  policyModules[`/content/policies/${path}.mdx`]?.();
