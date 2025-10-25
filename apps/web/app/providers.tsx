"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { DialogProvider, useInitializeDialog } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import { HOSTNAME } from "@/lib/constants";
import { getQueryClient } from "./get-query-client";

if (typeof window !== "undefined") {
  if (env.NEXT_ENV === "production") {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      persistence: "localStorage",
      __add_tracing_headers: [HOSTNAME],
    });
  }
}

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then(
      (mod) => mod.ReactQueryDevtools,
    ),
  { ssr: false },
);

const DialogInitializer = () => {
  useInitializeDialog();

  return null;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <DialogProvider>
            {children}

            {env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}

            <DialogInitializer />
          </DialogProvider>

          <Toaster />
        </NuqsAdapter>
      </QueryClientProvider>
    </PostHogProvider>
  );
}
