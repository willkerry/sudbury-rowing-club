"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Container } from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { SignedUrlErrorCode } from "@/lib/signed-url-errors";

type DelayedErrorProps = {
  errorCode: SignedUrlErrorCode;
  errorMessage: string;
  delay: number;
  loadingState: ReactNode;
  badUrl?: string;
  referrer?: string;
};

export const DelayedError = ({
  errorCode,
  errorMessage,
  delay,
  loadingState,
  badUrl,
  referrer,
}: DelayedErrorProps) => {
  const [showError, setShowError] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (showError) {
      posthog.capture("redirect_error", {
        errorCode,
        errorMessage,
        badUrl,
        referrer,
      });
    }
  }, [showError, posthog, errorCode, errorMessage, badUrl, referrer]);

  if (!showError) return <>{loadingState}</>;

  return (
    <>
      <PageHeader prose title="Unable to redirect" />

      <Container className="prose max-w-prose">
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        <div className="mb-12 text-gray-600 text-sm">
          <p>This could happen if:</p>
          <ul>
            <li>The link is broken or outdated</li>
            <li>The URL format is invalid</li>
            <li>The link has been modified or tampered with</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <Button asChild icon={<Home />} variant="default">
            <Link href="/">Go to homepage</Link>
          </Button>
        </div>
      </Container>
    </>
  );
};
