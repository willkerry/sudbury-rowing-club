"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { getQueryClient } from "./get-query-client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY)
    throw new Error("Missing NEXT_PUBLIC_POSTHOG_KEY");
  if (!process.env.NEXT_PUBLIC_POSTHOG_HOST)
    throw new Error("Missing NEXT_PUBLIC_POSTHOG_HOST");

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only",
  });
}

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then(
      (mod) => mod.ReactQueryDevtools,
    ),
  { ssr: false },
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        {children}

        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}

        <Toaster />
      </QueryClientProvider>
    </PostHogProvider>
  );
}
