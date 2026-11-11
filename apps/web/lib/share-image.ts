import { z } from "zod";

export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 600;

export const shareImageVariants = ["blue", "dark", "light"] as const;

export const ShareImageSchema = z.object({
  subtitle: z.string().default(""),
  title: z.string(),
  /**
   * Customise the colour scheme of the image. Defaults to `blue`.
   */
  variant: z.enum(shareImageVariants).default("blue"),
});

export type ShareImage = z.infer<typeof ShareImageSchema>;

/**
 * Serialises a share image in a fixed parameter order, so the same image
 * always produces the same query string (and so the same signature and cache
 * key).
 */
export const toShareImageParams = ({
  title,
  subtitle,
  variant,
}: ShareImage): URLSearchParams => {
  const params = new URLSearchParams({ title });

  if (subtitle) params.set("subtitle", subtitle);
  if (variant !== "blue") params.set("variant", variant);

  return params;
};

export const parseShareImageParams = (
  params: URLSearchParams,
): ShareImage | undefined => {
  const result = ShareImageSchema.safeParse({
    subtitle: params.get("subtitle") ?? undefined,
    title: params.get("title") ?? undefined,
    variant: params.get("variant") ?? undefined,
  });

  return result.success ? result.data : undefined;
};
