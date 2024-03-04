import NextLink from "next/link";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
  download?: boolean;
  arrow?: boolean;
  external?: boolean;
  extension?: string;
  className?: string;
  unstyled?: boolean;
};

// Ridiculous hack because I set up an awful component API
const assignIcon = (
  external: boolean,
  download: boolean,
  arrow: boolean,
): typeof ArrowRightIcon => {
  if (external) return ArrowUpRightIcon;
  if (download) return ArrowDownIcon;
  if (arrow) return ArrowRightIcon;
  return ArrowRightIcon;
};

const Link = ({
  href,
  children,
  dark = false,
  external = false,
  download = false,
  arrow = false,
  extension,
  className,
  unstyled = false,
}: Props) => {
  const hasIcon = external || download || arrow;
  const RightIcon = assignIcon(external, download, arrow);

  const isExternal = href.startsWith("http") || external;
  const LinkComponent = isExternal ? "a" : NextLink;

  return (
    <LinkComponent
      href={href}
      className={cn(
        unstyled
          ? "stour-link"
          : [
              "group break-words transition",
              dark
                ? "text-blue-100 hover:text-white"
                : "text-blue-500 hover:text-blue-300",
            ],
        className,
      )}
      {...(isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      <>
        {children}
        {extension && (
          <span className="ml-1 rounded-full border px-1 text-xs font-medium uppercase text-gray-400 transition">
            {extension}
          </span>
        )}
        {hasIcon && (
          <RightIcon
            aria-hidden
            className={cn(
              "mb-0.5 ml-0.5 inline h-4 w-4 transition",
              arrow && "group-hover:translate-x-[0.05rem]",
              external && "group-hover:rotate-45",
              download && "group-hover:translate-y-[0.05rem]",
            )}
          />
        )}
      </>
    </LinkComponent>
  );
};

export default Link;
