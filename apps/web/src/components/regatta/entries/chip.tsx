"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useBoatHighlight } from "./boat-highlight-context";
import { sanitizeBoatClass } from "./sanitize-boat-class";

export const Chip = ({
  children,
  color,
  location,
  id,
  className,
}: {
  children: React.ReactNode;
  location: "table" | "list";
  color: string;
  id: string;
  className?: string;
}) => {
  const { register, highlight, unhighlight } = useBoatHighlight();
  const sanitisedId = useMemo(() => sanitizeBoatClass(id), [id]);

  const ref = useCallback(
    (el: HTMLButtonElement | null) => {
      register(sanitisedId, location, el);
    },
    [register, sanitisedId, location],
  );

  return (
    <button
      className={cn(
        "rounded-sm px-0.5 font-medium ring-black ring-offset-1 transition",
        color,
        className,
        "hover:cursor-default hover:opacity-50 hover:ring-0",
      )}
      onBlur={() => unhighlight(sanitisedId)}
      onClick={() => highlight(sanitisedId)}
      onFocus={() => highlight(sanitisedId)}
      onMouseEnter={() => highlight(sanitisedId)}
      onMouseLeave={() => unhighlight(sanitisedId)}
      ref={ref}
      type="button"
    >
      {children}
    </button>
  );
};
