"use client";

import { memo, type MouseEventHandler } from "react";
import Link from "next/link";
import { animateScroll } from "react-scroll";
import type { SerializableTOC } from "@fumadocs/content-collections/configuration";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { chain } from "radash";

const removePrecedingNumbers = (title: string) =>
  title.replace(/^\d+\./, "").replace(/^\d+\)/, "");
const removeTrailingPunctuation = (title: string) =>
  title.replace(/\.$/, "").replace(/\)$/, "");

const formatTitle = chain(removePrecedingNumbers, removeTrailingPunctuation);

const getDepthClassName = (depth: number) => {
  switch (depth) {
    case 3:
      return "pl-4";
    case 4:
      return "pl-8";
    case 5:
      return "pl-10";
    case 6:
      return "pl-12";
    default:
      return "";
  }
};

export const TableOfContentsItem = memo(
  ({
    title,
    depth,
    url,
    isActive,
  }: SerializableTOC[number] & { isActive: boolean }) => {
    const router = useRouter();

    const scrollTo: MouseEventHandler<HTMLAnchorElement> = (e) => {
      e.preventDefault();
      router.push(url, { scroll: false });

      const heading = document.getElementById(url.slice(1));
      if (heading) {
        const y = heading.getBoundingClientRect().top - 10;

        animateScroll.scrollMore(y);
      }
    };

    return (
      <li>
        <Link
          href={url}
          onClick={scrollTo}
          className={cn(
            "text-sm hover:text-gray-900 line-clamp-1 py-1",
            depth <= 2 ? "text-gray-700" : "text-gray-500",
            // isActive && "text-blue-500",
            getDepthClassName(depth),
            "data-[active='true']:text-blue-500",
          )}
          data-active={isActive || undefined}
          // style={depth - 2 ? { paddingLeft: `${depth - 2}em` } : undefined}
        >
          {formatTitle(title)}
        </Link>
      </li>
    );
  },
);
