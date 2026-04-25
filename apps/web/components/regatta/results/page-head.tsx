import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Inline serif page header used on bespoke regatta-results pages. Smaller
 * than the site-wide `PageHeader` – the live pages are content-dense and
 * don't need the vertical real estate a marketing-style header claims.
 */
export const PageHead = ({
  eyebrow,
  title,
  sub,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  sub?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) => (
  <header
    className={cn(
      "mx-auto mt-6 mb-6 flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4",
      className,
    )}
  >
    <div className="min-w-0">
      {eyebrow && (
        <div className="text-gray-700 text-xs uppercase tracking-wider">
          {eyebrow}
        </div>
      )}

      <h1 className="mt-1 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
        {title}
      </h1>

      {sub && <div className="mt-1 text-gray-700 text-sm">{sub}</div>}
    </div>

    {actions && <div className="shrink-0">{actions}</div>}
  </header>
);
