import { getClubByBoatCode, getClubById } from "@/lib/getClub";

const INTEGER_REGEX = /^\d+$/;

/**
 * A British Rowing club id, a club (or alias) boat code, or a blade image URL.
 */
export type BladeSource = number | string | null | undefined;

const isImageSource = (src: string) => src.startsWith("/") || URL.canParse(src);

/** Resolve a blade source to an image URL, or null where no blade is known. */
export const resolveBladeSource = (src: BladeSource): string | null => {
  if (src === null || src === undefined || src === "") return null;

  if (typeof src === "number" || INTEGER_REGEX.test(src)) {
    return getClubById(Number(src))?.bladeUrl ?? null;
  }

  if (isImageSource(src)) return src;

  return getClubByBoatCode(src)?.bladeUrl ?? null;
};
