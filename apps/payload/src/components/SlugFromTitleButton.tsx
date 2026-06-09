"use client";

import { Button, useField } from "@payloadcms/ui";
import slugify from "slugify";

const SLUGIFY_OPTS = { lower: true, strict: true, trim: true } as const;

/**
 * After-input adornment on a slug field. Reads the sibling `title` and
 * writes a slugified version into the current field on click.
 *
 * Wire on a field via:
 *   admin: { components: { afterInput: ['/components/SlugFromTitleButton'] } }
 *
 * Assumes the form has a `title` field. If not, the button is disabled.
 */
export default function SlugFromTitleButton() {
  const { value: title } = useField<string>({ path: "title" });
  const { setValue } = useField<string>({ path: "slug" });

  const onClick = () => {
    if (!title) return;
    setValue(slugify(title, SLUGIFY_OPTS));
  };

  return (
    <Button
      buttonStyle="subtle"
      disabled={!title}
      extraButtonProps={{ style: { marginTop: "0.5rem" } }}
      margin={false}
      onClick={onClick}
      size="xsmall"
    >
      Generate from title
    </Button>
  );
}
