import "server-only";

import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import { getHostname } from "@/lib/helpers/getHostname";
import { verifyRedirectUrl } from "@/lib/redirect";
import { isSignedUrlError } from "@/lib/signed-url-errors";
import { AutoRedirect } from "./auto-redirect";
import { DelayedError } from "./delayed-error";
import { LoadingState } from "./loading-state";

const AUTO_REDIRECT_DELAY = 2000;

export const metadata: Metadata = {
  title: "Redirecting to external link",
  robots: {
    follow: false,
    index: false,
  },
};

type PageProps = {
  searchParams: Promise<{ url?: string; sig?: string }>;
};

const RedirectPage = async ({ searchParams }: PageProps) => {
  const { url, sig } = await searchParams;
  const headersList = await headers();
  const referrer = headersList.get("referer") || undefined;

  const result = (() => {
    try {
      const verifiedUrl = verifyRedirectUrl(url ?? "", sig ?? "");
      return { success: true as const, url: verifiedUrl };
    } catch (err) {
      if (isSignedUrlError(err)) {
        return {
          errorCode: err.code,
          errorMessage: err.userMessage,
          success: false as const,
        };
      }

      throw err;
    }
  })();

  if (!result.success) {
    return (
      <DelayedError
        badUrl={url}
        delay={AUTO_REDIRECT_DELAY}
        errorCode={result.errorCode}
        errorMessage={result.errorMessage}
        loadingState={<LoadingState delay={AUTO_REDIRECT_DELAY} />}
        referrer={referrer}
      />
    );
  }

  const domain = getHostname(result.url);

  return (
    <>
      <Suspense fallback={null}>
        <AutoRedirect delay={AUTO_REDIRECT_DELAY} url={result.url} />
      </Suspense>

      <LoadingState
        delay={AUTO_REDIRECT_DELAY}
        domain={domain}
        verifiedUrl={result.url}
      />
    </>
  );
};

export default RedirectPage;
