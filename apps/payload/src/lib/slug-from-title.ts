import type { FieldHook } from "payload";
import slugify from "slugify";

const SLUGIFY_OPTS = { lower: true, strict: true, trim: true } as const;

/**
 * Field-level beforeValidate hook for a slug field: if the current value is
 * empty, derive it from the sibling `title`. Pair with the admin
 * `SlugFromTitleButton` component for an on-demand regenerate.
 */
export const slugFromTitle: FieldHook = ({ value, siblingData }) => {
  const current = typeof value === "string" ? value.trim() : "";
  if (current) return current;
  const title = (siblingData as { title?: string } | undefined)?.title;
  if (!title) return value;

  return slugify(title, SLUGIFY_OPTS);
};
