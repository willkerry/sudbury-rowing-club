import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

export type DetailProps = {
  summary: string;
  icon: React.ReactNode;
  href: string;
};

export const Details = ({ items }: { items: DetailProps[] }) => (
  <div className="flex flex-col">
    {items.map(({ summary, icon, href }, i) => (
      <Link
        className={cn([
          "relative",
          "group flex items-center gap-x-2.5 p-4 transition-colors",
          "first:rounded-t last:rounded-b",
          "border-x border-b first:border-t",
          "hover:bg-blue-50 focus:bg-blue-50",
          "transition-colors",
        ])}
        href={href}
        id={summary}
        key={summary}
      >
        <div
          className={cn({
            "absolute -inset-px transition-colors": true,
            "border-[1.5px] border-transparent group-hover:border-blue-300": true,
            "rounded-b": i === items.length - 1,
            "rounded-t": i === 0,
          })}
        />

        <Slot.Slot
          aria-hidden
          className="h-6 w-6 stroke-[1.5px] text-gray-400 transition-colors group-hover:text-blue-600 group-focus:text-blue-600"
        >
          {icon}
        </Slot.Slot>

        <div>{summary}</div>

        <ArrowRightIcon
          aria-hidden
          className="ml-auto h-6 w-6 text-gray-300 transition-colors group-hover:text-blue-500 group-focus:text-blue-500"
        />
      </Link>
    ))}
  </div>
);
