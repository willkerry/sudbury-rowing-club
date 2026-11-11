"use client";

import { IconRotate } from "@tabler/icons-react";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import Center from "@/components/stour/center";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SafetyError({ error, reset }: ErrorProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.captureException(error);
  }, [posthog, error]);

  return (
    <Center className="my-40 flex-col gap-6">
      <ErrorMessage error={error} label={error.name} />

      <Button icon={<IconRotate />} onClick={reset} variant="secondary">
        Try again
      </Button>
    </Center>
  );
}
