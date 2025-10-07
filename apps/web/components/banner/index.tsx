"use client";

import {
  useClickOutside,
  useFocusWithin,
  useMergedRef,
  useWindowEvent,
} from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import cn from "clsx";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import type { Notice } from "@/app/api/notice/route";
import { kyInstance } from "@/app/get-query-client";
import { Container } from "@/components/layouts/container";
import { Text } from "@/components/stour/text";
import { DateFormatter } from "@/components/utils/date-formatter";

const LINK_REGEX = /^(https?|mailto):\/\//;
const PATH_REGEX = /^\/[a-z0-9-]+/;

const bannerVariants: Record<
  Notice["type"][number],
  {
    bgColor: string;
    textColor: string;
    textHover: string;
  }
> = {
  primary: {
    bgColor: "bg-blue-800",
    textColor: "text-blue-50",
    textHover: "group-hover:text-blue-200 group-focus:text-blue-200",
  },
  secondary: {
    bgColor: "bg-black",
    textColor: "text-gray-200",
    textHover: "group-hover:text-blue-300 group-focus:text-blue-300",
  },
  success: {
    bgColor: "bg-green-800",
    textColor: "text-green-200",
    textHover: "group-hover:text-green-400 group-focus:text-green-400",
  },
  warning: {
    bgColor: "bg-amber-500",
    textColor: "text-gray-950",
    textHover: "group-hover:text-yellow-900 group-focus:text-yellow-900",
  },
  error: {
    bgColor: "bg-red-700",
    textColor: "text-red-50",
    textHover: "group-hover:text-red-300 group-focus:text-red-300",
  },
};

const controlTypes = ["button", "a"] as const;
const controlVariants: Record<
  (typeof controlTypes)[number],
  {
    text: string;
    className: string;
    classNameExpanded?: string;
  }
> = {
  button: {
    text: "Read more",
    className: "group-hover:rotate-90",
    classNameExpanded: "rotate-90 group-hover:-rotate-90",
  },
  a: {
    text: "Go",
    className: "group-hover:translate-x-0.5 group-active:translate-x-1.5",
  },
};

const ButtonOrAnchor = (
  props:
    | ({ type: "button" } & Collapsible.CollapsibleTriggerProps)
    | ({ type: "a" } & LinkProps),
) => {
  if (props.type === "button") {
    const { type: _, ...buttonProps } = props;
    return <Collapsible.Trigger {...buttonProps} />;
  }

  const { type: _, ...anchorProps } = props;
  return <Link target="_blank" rel="noopener noreferrer" {...anchorProps} />;
};

export const Banner = () => {
  const { data, error } = useQuery({
    queryKey: ["notice"],
    queryFn: ({ signal }) =>
      kyInstance.get<Notice>("/api/notice", { signal }).json(),
    staleTime: 5 * 60 * 1000,
  });

  const collapsibleRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const scrollHandler = () => {
    if (window.scrollY > 100) setExpanded(false);
  };
  useWindowEvent("scroll", scrollHandler);

  const { ref: focusRef } = useFocusWithin({
    onBlur: () => setExpanded(false),
  });

  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => {
    setExpanded(false);
  });
  const mergedRef = useMergedRef(collapsibleRef, clickOutsideRef, focusRef);

  useEffect(() => {
    if (!pathname) return;

    setExpanded(false);
  }, [pathname]);

  if (error || !data || !data.display) return null;

  const controlType: (typeof controlTypes)[number] = (() => {
    if (data.link?.match(LINK_REGEX)) return "a";
    if (data.link?.match(PATH_REGEX)) return "a";
    return "button";
  })();

  const { text, className, classNameExpanded } = controlVariants[controlType];
  const { bgColor, textColor, textHover } =
    bannerVariants[data?.type || "primary"];

  return (
    <Collapsible.Root
      open={expanded}
      onOpenChange={setExpanded}
      ref={mergedRef}
    >
      <ButtonOrAnchor
        className={cn(
          "group z-50 flex w-full items-center py-2 text-sm",
          bgColor,
          textColor,
        )}
        type={controlType}
        href={data.link || "#"}
      >
        <Container className="text-left">
          <span className="mr-1 font-semibold">{data?.label} </span>
          <span className={cn(textHover, "whitespace-nowrap")}>
            {text}{" "}
            <span
              className={cn(
                "inline-block transform transition-transform",
                className,
                expanded && classNameExpanded,
              )}
            >
              &rarr;
            </span>
          </span>
        </Container>
      </ButtonOrAnchor>

      {!data.link && (
        <Collapsible.Content className="absolute z-40 w-full overflow-hidden bg-gray-50 shadow-sm transition-all duration-500">
          <Container>
            <Text portableText={data?.text} size="small" className="py-4" />

            {data.date && (
              <div className="mb-4 font-medium text-gray-700 text-xs">
                Updated{" "}
                <DateFormatter
                  format={data.includeTime ? "time" : undefined}
                  dateString={data.date}
                />
              </div>
            )}
          </Container>
        </Collapsible.Content>
      )}
    </Collapsible.Root>
  );
};
