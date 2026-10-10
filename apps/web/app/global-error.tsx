"use client";

import "../styles/index.css";
import { Home, RotateCcw } from "lucide-react";
import posthog from "posthog-js";
import { useEffect } from "react";
import { Container } from "@/components/layouts/container";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Replaces the root layout when it, or the root error boundary, throws. Nothing
 * from `layout.tsx` or `providers.tsx` is mounted here, so this must render its
 * own document and talk to PostHog directly.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (posthog.__loaded) posthog.captureException(error);
  }, [error]);

  return (
    <html lang="en-GB">
      <body>
        <Container className="prose my-24 max-w-prose">
          <h1>Something went wrong.</h1>

          <p>
            The site could not be displayed. You can try again, or return to the
            homepage.
          </p>

          <div className="flex flex-col gap-4">
            <Button icon={<RotateCcw />} onClick={reset} variant="secondary">
              Try again
            </Button>
            <Button asChild icon={<Home />} variant="secondary">
              <a href="/">Return to the homepage</a>
            </Button>
          </div>
          <div className="h-12" />

          <ErrorMessage error={error} label={error.name}>
            {error.digest && (
              <p className="text-xs">
                Reference: <code>{error.digest}</code>
              </p>
            )}
          </ErrorMessage>
        </Container>
      </body>
    </html>
  );
}
