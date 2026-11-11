const CDN_BASE = "https://cdn.sudburyrowingclub.org.uk";

const normalizeSrc = (src: string) =>
  src.startsWith("/") ? src.slice(1) : src;

export type CloudflareImageOptions = {
  /** Width of the output image. */
  width?: number;
  /** Height of the output image. */
  height?: number;
  /** Quality of the output image (1-100). */
  quality?: number;
  /** Fit mode for resizing. */
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  /** Output format. */
  format?: "auto" | "avif" | "webp" | "json";
};

/**
 * Build a Cloudflare-optimised image URL.
 *
 * @param src - The original image URL or path
 * @param options - Resize and format options
 * @returns The Cloudflare CDN URL with transformations applied
 *
 * @example
 * ```ts
 * buildCloudflareImageUrl("https://example.com/image.png", { width: 150 })
 * // => "https://cdn.sudburyrowingclub.org.uk/cdn-cgi/image/width=150/https://example.com/image.png"
 * ```
 */
export const buildCloudflareImageUrl = (
  src: string,
  options: CloudflareImageOptions = {},
): string => {
  const params: string[] = [];

  if (options.width) {
    params.push(`width=${options.width}`);
  }

  if (options.height) {
    params.push(`height=${options.height}`);
  }

  if (options.quality) {
    params.push(`quality=${options.quality}`);
  }

  if (options.fit) {
    params.push(`fit=${options.fit}`);
  }

  if (options.format) {
    params.push(`format=${options.format}`);
  }

  if (params.length === 0) {
    return src;
  }

  const paramsString = params.join(",");

  return `${CDN_BASE}/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};

/**
 * Next.js Image loader for Cloudflare Images.
 * Use this with the `loader` prop on Next.js `Image` components.
 *
 * @example
 * ```tsx
 * import Image from "next/image";
 * import { cloudflareLoader } from "@sudburyrc/image-urls/cloudflare";
 *
 * <Image src={url} loader={cloudflareLoader} width={100} height={50} />
 * ```
 */
export const cloudflareLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string => buildCloudflareImageUrl(src, { width, quality });
