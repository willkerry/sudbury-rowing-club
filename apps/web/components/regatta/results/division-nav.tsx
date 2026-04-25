import Link from "next/link";
import type { DivisionNavItem } from "@/lib/regatta/results";
import { cn } from "@/lib/utils";

/**
 * Thin strip of anchors linking to adjacent divisions, hoisted out of the
 * upstream table into a proper <nav>. The source provides five entries:
 * first, previous, current, next, last. The current entry is rendered
 * non-linked and visually distinct.
 */
export const DivisionNav = ({ items }: { items: DivisionNavItem[] }) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Division navigation"
      className="border-gray-200 border-y bg-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 text-sm">
        {items.map((item, index) => {
          const key = `${item.label}-${index}`;

          if (item.current || !item.href) {
            return (
              <span
                aria-current={item.current ? "page" : undefined}
                className="px-2 font-semibold text-gray-900"
                key={key}
                title={item.title ?? undefined}
              >
                {item.label}
              </span>
            );
          }

          return (
            <Link
              className={cn(
                "px-2 text-blue-600 hover:underline",
                item.label.length <= 2 && "font-semibold",
              )}
              href={item.href}
              key={key}
              title={item.title ?? undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
