"use client";

import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@mantine/hooks";
import Link from "next/link";
import type { PostHog } from "posthog-js";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const COOKIE_TOAST_ID = "cookie-banner";

const LOCAL_STORAGE_KEY = "acceptedCookies";

export const useCookieBanner = (posthog: PostHog | undefined) => {
  const [acceptedCookies, setAcceptedCookies] = useLocalStorage<
    "accepted" | "declined" | "pending"
  >({
    key: LOCAL_STORAGE_KEY,
    defaultValue: "pending",
    getInitialValueInEffect: false,
  });

  useEffect(() => {
    switch (acceptedCookies) {
      case "pending":
        toast(
          <div>
            <p className="mb-3">
              We use one cookie to help catch problems people encounter on our
              website.
            </p>

            <div className="flex justify-end gap-2">
              <Button asChild size="xs" variant="link">
                <Link href="/governance/privacy-policy#cookies">
                  More information
                </Link>
              </Button>

              <Button
                size="xs"
                variant="secondary"
                onClick={() => {
                  setAcceptedCookies("declined");
                  posthog?.opt_out_capturing();
                  toast.dismiss(COOKIE_TOAST_ID);
                }}
              >
                Decline
              </Button>

              <Button
                size="xs"
                onClick={() => {
                  setAcceptedCookies("accepted");
                  posthog?.opt_in_capturing();
                  toast.dismiss(COOKIE_TOAST_ID);
                }}
              >
                Accept
              </Button>
            </div>
          </div>,
          {
            id: COOKIE_TOAST_ID,
            duration: Number.POSITIVE_INFINITY,
            dismissible: true,
          },
        );
        break;

      case "accepted":
        if (posthog && !posthog.has_opted_in_capturing()) {
          posthog.opt_in_capturing();
        }
        break;

      case "declined":
        if (posthog && !posthog.has_opted_out_capturing()) {
          posthog.opt_out_capturing();
        }
        break;
    }
  }, [posthog, setAcceptedCookies, acceptedCookies]);
};

export const useReopenCookieBanner = () => {
  const [acceptedCookies, setAcceptedCookies] = useLocalStorage<
    "accepted" | "declined" | "pending"
  >({
    key: LOCAL_STORAGE_KEY,
    defaultValue: "pending",
  });

  return useCallback(() => {
    if (acceptedCookies === "pending") {
      return toast("Cookie settings are already open.", {
        duration: 1000,
      });
    }

    setAcceptedCookies("pending");
  }, [acceptedCookies, setAcceptedCookies]);
};
