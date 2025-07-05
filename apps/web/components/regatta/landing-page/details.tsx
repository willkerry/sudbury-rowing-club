import { Slot } from "@radix-ui/react-slot";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type DetailProps = {
  summary: string;
  icon: React.ReactNode;
  href: string;
};

export const Details = ({ items }: { items: DetailProps[] }) => (
  <div className="flex flex-col">
    {items.map(({ summary, icon, href }, i) => (
      <Link
        key={summary}
        id={summary}
        href={href}
        className={cn([
          "relative",
          "group flex items-center gap-x-2.5 p-4 transition-colors",
          "first:rounded-t last:rounded-b",
          "border-x border-b first:border-t",
          "hover:bg-blue-50 focus:bg-blue-50",
          "transition-colors",
        ])}
      >
        <div
          className={cn({
            "-inset-px absolute transition-colors": true,
            "border-[1.5px] border-transparent group-hover:border-blue-300": true,
            "rounded-t": i === 0,
            "rounded-b": i === items.length - 1,
          })}
        />

        <Slot
          aria-hidden
          className="h-6 w-6 stroke-[1.5px] text-gray-400 transition-colors group-hover:text-blue-600 group-focus:text-blue-600"
        >
          {icon}
        </Slot>

        <div>{summary}</div>

        <ArrowRightIcon
          className="ml-auto h-6 w-6 text-gray-300 transition-colors group-hover:text-blue-500 group-focus:text-blue-500"
          aria-hidden
        />
      </Link>
    ))}
  </div>
);
