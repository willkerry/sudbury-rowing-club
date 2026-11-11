"use client";

import {
  type DetailedHTMLProps,
  type InsHTMLAttributes,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ServerOrClientDateFormatter } from "@/components/utils/server-or-client-date-formatter";
import { cn } from "@/lib/utils";

const COLORS = {
  1: "bg-green-50 border-green-300",
  2: "bg-amber-50 border-amber-300",
} as const;

const FOREGROUND_COLORS = {
  1: "text-green-700",
  2: "text-amber-700",
} as const;

const AMENDEMENTS = {
  1: new Date("2019-02-25"),
  2: new Date("2023-10-24"),
} as const;

const AmendmentDate = ({ set }: { set: keyof typeof COLORS }) => (
  <>
    <span className="sr-only"> Amendment ratified in </span>
    <ServerOrClientDateFormatter
      className="disambiguate font-semibold text-xs"
      dateString={AMENDEMENTS[set]}
      format="year"
    />
  </>
);

type InsProps = {
  set?: keyof typeof COLORS;
} & DetailedHTMLProps<InsHTMLAttributes<HTMLModElement>, HTMLModElement>;

export const Ins = ({ set = 1, children, ...props }: InsProps) => (
  <ins
    className={cn(
      "mx-0.5 -my-0.5 rounded-sm border px-0.5 py-0.5 not-italic no-underline",
      COLORS[set],
    )}
    dateTime={AMENDEMENTS[set].toISOString()}
    {...props}
  >
    {children}
    <span className={cn("px-1", FOREGROUND_COLORS[set])}>
      <AmendmentDate set={set} />
    </span>
  </ins>
);

export const InsBlock = ({ set = 1, children, ...props }: InsProps) => {
  const innerRef = useRef<HTMLModElement>(null);
  const [margins, setMargins] = useState({ bottom: "0px", top: "0px" });
  const [badgeTarget, setBadgeTarget] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const children = [...inner.children].filter(
      (c): c is HTMLElement =>
        c instanceof HTMLElement && !("badge" in c.dataset),
    );
    if (children.length === 0) return;

    const first = children[0];
    const last = children.at(-1) ?? first;

    setMargins({
      bottom: getComputedStyle(last).marginBottom,
      top: getComputedStyle(first).marginTop,
    });

    first.style.marginTop = "0";
    last.style.marginBottom = "0";

    if (last.tagName === "P") {
      setBadgeTarget(last);
    }

    return () => {
      first.style.marginTop = "";
      last.style.marginBottom = "";
    };
  }, []);

  const badge = (
    <span className={cn("ml-1 inline", FOREGROUND_COLORS[set])} data-badge="">
      <AmendmentDate set={set} />
    </span>
  );

  return (
    <div style={{ paddingBottom: margins.bottom, paddingTop: margins.top }}>
      <ins
        className={cn(
          "block rounded-sm border px-2 py-1 no-underline",
          COLORS[set],
        )}
        dateTime={AMENDEMENTS[set].toISOString()}
        ref={innerRef}
        {...props}
      >
        {children}
        {!badgeTarget && badge}
      </ins>
      {badgeTarget && createPortal(badge, badgeTarget)}
    </div>
  );
};
