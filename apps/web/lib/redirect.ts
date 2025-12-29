import { createHmac } from "node:crypto";
import { env } from "@/env";
import { SignedUrlError, SignedUrlErrorCode } from "./signed-url-errors";

/**
 * Generate an HMAC signature for a URL to prevent tampering
 */
const signUrl = (url: string): string => {
  const hmac = createHmac("sha256", env.REDIRECT_SECRET);
  hmac.update(url);

  return hmac.digest("hex");
};

/**
 * Verify that a URL signature is valid
 */
const verifyUrlSignature = (url: string, signature: string): boolean => {
  const expectedSignature = signUrl(url);

  return timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex"),
  );
};

/**
 * Timing-safe comparison to prevent timing attacks
 */
const timingSafeEqual = (a: Buffer, b: Buffer): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
};

/**
 * Create a signed redirect URL that can be safely used in links
 *
 * @param destinationUrl - The external URL to redirect to
 * @returns A path that can be used in Next.js Link components
 *
 * @example
 * ```tsx
 * import { createRedirectUrl } from '@/lib/redirect';
 *
 * const externalLink = createRedirectUrl('https://example.com/event');
 * // Returns: '/redirect?url=https%3A%2F%2Fexample.com%2Fevent&sig=abc123...'
 *
 * <Link href={externalLink}>View Event</Link>
 * ```
 */
export const createRedirectUrl = (destinationUrl: string): string => {
  const signature = signUrl(destinationUrl);
  const params = new URLSearchParams({
    url: destinationUrl,
    sig: signature,
  });

  return `/redirect?${params.toString()}`;
};

/**
 * Verify and extract the destination URL from redirect parameters
 *
 * @param url - The destination URL
 * @param signature - The HMAC signature
 * @returns The verified URL
 * @throws {SignedUrlError} If verification fails
 */
export const verifyRedirectUrl = (url: string, signature: string): string => {
  if (!url) {
    throw new SignedUrlError(
      SignedUrlErrorCode.MISSING_PARAMETERS,
      "Missing URL parameter",
    );
  }

  if (!signature) {
    throw new SignedUrlError(
      SignedUrlErrorCode.MISSING_PARAMETERS,
      "Missing signature parameter",
    );
  }

  if (verifyUrlSignature(url, signature)) {
  } else {
    throw new SignedUrlError(
      SignedUrlErrorCode.INVALID_SIGNATURE,
      "HMAC signature verification failed",
    );
  }

  try {
    const parsedUrl = new URL(url);

    if (!parsedUrl.protocol.startsWith("http")) {
      throw new SignedUrlError(
        SignedUrlErrorCode.UNSUPPORTED_PROTOCOL,
        `Protocol ${parsedUrl.protocol} is not supported`,
      );
    }

    return url;
  } catch (error) {
    if (error instanceof SignedUrlError) {
      throw error;
    }

    throw new SignedUrlError(
      SignedUrlErrorCode.INVALID_URL_FORMAT,
      `Failed to parse URL: ${url}`,
    );
  }
};
