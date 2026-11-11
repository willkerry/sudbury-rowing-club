import { env } from "@/env";
import { BASE_URL } from "@/lib/constants";
import { signShareImage } from "@/lib/server/share-image-signature";
import { type ShareImage, ShareImageSchema } from "@/lib/share-image";

const BASE_PATH = "/api/og";

const absoluteUrl = `${BASE_URL}${BASE_PATH}`;

type MakeShareImageURL = (
  title: ShareImage["title"],
  absolute?: boolean,
  options?: Partial<Omit<ShareImage, "title">>,
) => string;

/**
 * Server only: signs the URL with `OG_IMAGE_SECRET`. Client code gets signed
 * URLs from the `shareImage.sign` tRPC procedure.
 */
export const makeShareImageURL: MakeShareImageURL = (
  title,
  absolute,
  options,
) => {
  const image = ShareImageSchema.parse({ title, ...options });
  const searchParams = signShareImage(image, env.OG_IMAGE_SECRET).toString();
  const path = absolute ? absoluteUrl : BASE_PATH;

  return `${path}?${searchParams}`;
};
