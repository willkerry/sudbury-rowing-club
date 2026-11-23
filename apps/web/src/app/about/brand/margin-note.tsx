import "@fontsource-variable/caveat/index.css";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

const className =
  "not-prose absolute inset-y-0 left-full ml-6 hidden items-center gap-3 text-gray-500 xl:flex";

export const MarginNote = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) => {
  const content = (
    <>
      <svg
        aria-hidden
        className="h-full w-2.5 shrink-0"
        fill="none"
        preserveAspectRatio="none"
        stroke="currentColor"
        viewBox="0 0 10 100"
      >
        <path
          d="M1 2.5C4 1.6 6.5 1.2 8.4 1.8C8.9 28 8.1 64 8.8 98.2C6.2 98.4 3.4 98.9 0.8 98.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="-rotate-3 font-['Caveat_Variable',cursive] text-2xl whitespace-nowrap">
        {children}
      </span>
    </>
  );

  if (!href) return <span className={className}>{content}</span>;

  return (
    <NextLink
      className={cn(className, "transition-colors hover:text-gray-800")}
      href={href}
    >
      {content}
    </NextLink>
  );
};
