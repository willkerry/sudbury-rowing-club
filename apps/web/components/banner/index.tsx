"use client";

import type { Notice } from "@/app/api/notice/route";
import { kyInstance } from "@/app/get-query-client";
import { useQuery } from "@tanstack/react-query";
import cn from "clsx";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layouts/container";
import { Text } from "../stour/text";
import { DateFormatter } from "../utils/date-formatter";

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
    textHover: "group-hover:text-blue-200",
  },
  secondary: {
    bgColor: "bg-black",
    textColor: "text-gray-200",
    textHover: "group-hover:text-blue-300",
  },
  success: {
    bgColor: "bg-green-800",
    textColor: "text-green-200",
    textHover: "group-hover:text-green-400",
  },
  warning: {
    bgColor: "bg-amber-500",
    textColor: "text-gray-950",
    textHover: "group-hover:text-yellow-900",
  },
  error: {
    bgColor: "bg-red-700",
    textColor: "text-red-50",
    textHover: "group-hover:text-red-300",
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

type BaseButtonOrAnchorProps = {
  className?: string;
  children: React.ReactNode;
};

type ButtonOrAnchorProps =
  | (BaseButtonOrAnchorProps & {
      type: "button";
      onClick?: () => void;
    })
  | (BaseButtonOrAnchorProps & {
      type: "a";
      href: string;
    });

const ButtonOrAnchor = ({
  type,
  className,
  children,
  ...props
}: ButtonOrAnchorProps) =>
  ({
    button: (
      <button type="button" className={className} {...props}>
        {children}
      </button>
    ),
    a: (
      <a
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
  })[type];

export const Banner = () => {
  const { data, error } = useQuery({
    queryKey: ["notice"],
    queryFn: ({ signal }) =>
      kyInstance.get<Notice>("/api/notice", { signal }).json(),
    staleTime: 5 * 60 * 1000,
  });

  const textRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setExpanded(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (error || !data || !data.display) return null;

  const controlType: (typeof controlTypes)[number] = (() => {
    if (data.link?.match(/^(https?|mailto):\/\//)) return "a";
    if (data.link?.match(/^\/[a-z0-9-]+/)) return "a";
    return "button";
  })();

  const { text, className, classNameExpanded } = controlVariants[controlType];
  const { bgColor, textColor, textHover } =
    bannerVariants[data?.type || "primary"];

  return (
    <>
      <ButtonOrAnchor
        className={cn(
          "group z-50 flex w-full items-center py-2 text-sm",
          bgColor,
          textColor,
          expanded && "shadow-2xl",
        )}
        type={controlType}
        href={data.link || "#"}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Container className="text-left">
          <span className="font-semibold">{data?.label}</span>{" "}
          <span className={cn(textHover, "ml-2")}>
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
        <div
          className="absolute z-40 w-full overflow-hidden bg-gray-50 shadow-sm transition-all duration-500"
          style={{ maxHeight: expanded ? textRef.current?.scrollHeight : 0 }}
          aria-hidden={!expanded}
        >
          <div ref={textRef} className="h-full">
            <Container>
              <Text portableText={data?.text} size="small" className="py-4" />

              {data.date && (
                <div className="mb-4 font-medium text-gray-700 text-xs">
                  Updated <DateFormatter dateString={data.date} />
                </div>
              )}
            </Container>
          </div>
        </div>
      )}
    </>
  );
};
