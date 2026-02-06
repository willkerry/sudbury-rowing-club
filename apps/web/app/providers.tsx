"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import dynamic from "next/dynamic";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useState } from "react";
import superjson from "superjson";
import { DialogProvider, useInitializeDialog } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import { HOSTNAME } from "@/lib/constants";
import { trpc } from "@/lib/trpc/client";
import { getQueryClient } from "./get-query-client";

if (typeof window !== "undefined") {
  if (env.NODE_ENV === "production") {
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

function getUrl() {
  if (typeof window !== "undefined") return "/api/trpc";
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}/api/trpc`;

  return "http://localhost:4321/api/trpc";
}

const DialogInitializer = () => {
  useInitializeDialog();

  return null;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl(),
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <PostHogProvider client={posthog}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
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
      </trpc.Provider>
    </PostHogProvider>
  );
}
