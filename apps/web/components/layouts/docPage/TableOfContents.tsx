"use client";

import type { SerializableTOC } from "@fumadocs/content-collections/configuration";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { TableOfContentsItem } from "./TableOfContentsItem";

const getHeadings = (toc: SerializableTOC) =>
  toc
    .map(({ url }) => document.getElementById(url.slice(1)))
    .filter(Boolean) as HTMLHeadingElement[];

export const TableOfContents = ({
  toc,
  className,
  ...props
}: { toc: SerializableTOC } & React.HTMLAttributes<HTMLUListElement>) => {
  const headingsRef = useRef<HTMLHeadingElement[]>([]);

  useEffect(() => {
    headingsRef.current = getHeadings(toc);
  }, [toc]);

  const [activeHeading, setActiveHeading] = useState<string>();

  useEffect(() => {
    const handleScroll = () => {
      const headings = headingsRef.current;

      const activeHeading = headings.find(
        (heading) => heading.getBoundingClientRect().top > 0,
      );

      if (activeHeading) {
        setActiveHeading(activeHeading.id);
      } else {
        setActiveHeading(undefined);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ul className={cn("not-prose max-w-sm", className)} {...props}>
      {toc.map((props) => {
        const isActive = activeHeading === props.url.slice(1);

        return (
          <TableOfContentsItem key={props.url} isActive={isActive} {...props} />
        );
      })}
    </ul>
  );
};
