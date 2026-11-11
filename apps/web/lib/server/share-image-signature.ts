import { createHmac, timingSafeEqual } from "node:crypto";
import {
  parseShareImageParams,
  type ShareImage,
  toShareImageParams,
} from "@/lib/share-image";

const SIGNATURE_PARAM = "sig";

const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

/**
 * Builds the signed query string for a share image. The OG Worker only renders
 * images whose signature matches, so nobody can spend the Browser Rendering
 * quota on arbitrary text.
 */
export const signShareImage = (
  image: ShareImage,
  secret: string,
): URLSearchParams => {
  const params = toShareImageParams(image);
  params.set(SIGNATURE_PARAM, sign(params.toString(), secret));

  return params;
};

export const verifyShareImage = (
  params: URLSearchParams,
  secret: string,
): ShareImage | undefined => {
  const signature = params.get(SIGNATURE_PARAM);
  if (!signature) return;

  const image = parseShareImageParams(params);
  if (!image) return;

  const expected = Buffer.from(
    sign(toShareImageParams(image).toString(), secret),
  );
  const actual = Buffer.from(signature);

  if (expected.length !== actual.length) return;
  if (!timingSafeEqual(expected, actual)) return;

  return image;
};
