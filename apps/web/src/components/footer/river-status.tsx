"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DateFormatter } from "@/components/utils/date-formatter";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types/severity";

const DOT_CLASSES: Record<Severity, string> = {
  amber: "bg-yellow-500",
  green: "bg-green-500",
  neutral: "bg-gray-400",
  red: "bg-red-500",
};

const SEVERITY_LABELS: Record<Severity, string> = {
  amber: "Amber",
  green: "Green",
  neutral: "No warnings",
  red: "Red",
};

// The footer is on every page, so only spend a rate-limited request once it is nearly on screen.
const useNearViewport = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isNear) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsNear(true);
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [isNear]);

  return [ref, isNear] as const;
};

export const RiverStatus = ({ className }: { className?: string }) => {
  const trpc = useTRPC();
  const [ref, isNear] = useNearViewport<HTMLDivElement>();

  const { data, isError, isSuccess } = useQuery({
    ...trpc.safety.status.queryOptions(),
    enabled: isNear,
  });

  const isUnavailable = isError || (data?.errors?.length ?? 0) > 0;
  const status: Severity = isUnavailable
    ? "neutral"
    : (data?.status ?? "neutral");
  const isWarning = status === "red" || status === "amber";

  return (
    <div className={className} ref={ref}>
      <Link
        className={cn(
          "group flex min-h-16 items-center justify-between gap-4 rounded-md bg-white px-5 py-4 text-sm transition-[background-color,transform] duration-150 ease-out hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden active:scale-[0.99]",
        )}
        href="/safety"
      >
        <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span className="font-medium text-gray-900">River status</span>

          {(isSuccess || isError) && (
            <span className="flex items-center gap-2 text-gray-600 transition-opacity duration-200 ease-out starting:opacity-0">
              <span aria-hidden className="relative flex size-2 shrink-0">
                {isWarning && (
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping",
                      DOT_CLASSES[status],
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative size-2 rounded-full",
                    DOT_CLASSES[status],
                  )}
                />
              </span>

              {isUnavailable ? (
                "Unavailable"
              ) : (
                <span>
                  <span
                    className={cn(isWarning && "font-medium text-gray-900")}
                  >
                    {SEVERITY_LABELS[status]}
                    {data?.source && ` – ${data.statusMessage}`}
                  </span>
                  {data?.date && (
                    <>
                      {" · "}
                      <DateFormatter
                        dateString={data.date}
                        format={{
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          month: "short",
                        }}
                      />
                    </>
                  )}
                </span>
              )}
            </span>
          )}
        </span>

        <span className="flex shrink-0 items-center gap-1 text-gray-600 transition-colors duration-150 group-hover:text-gray-900">
          <span className="hidden sm:inline">Conditions and forecast</span>
          <IconArrowRight
            aria-hidden
            className="size-4 text-blue-500 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
          />
        </span>
      </Link>
    </div>
  );
};
