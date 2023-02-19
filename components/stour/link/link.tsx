import NextLink from "next/link";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/20/solid";

type Props = {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
  download?: boolean;
  arrow?: boolean;
  external?: boolean;
  extension?: string;
  className?: string;
};

// Ridiculous hack because I set up an awful component API
const assignIcon = (
  external: boolean,
  download: boolean,
  arrow: boolean
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
}: Props) => {
  const hasIcon = external || download || arrow;
  const RightIcon = assignIcon(external, download, arrow);

  return (
    <NextLink
      href={href}
      className={`transition whitespace-nowrap ${
        dark
          ? "text-blue-100 hover:text-white"
          : "text-blue-500 hover:text-blue-300"
      } ${className !== undefined ? className : ""}`}
    >
      <>
        {children}
        {extension && (
          <span className="px-1 ml-1 text-xs font-medium text-gray-400 uppercase transition border rounded-full">
            {extension}
          </span>
        )}
        {hasIcon && <RightIcon className="inline mb-0.5 ml-1 w-4 h-4" />}
      </>
    </NextLink>
  );
};

export default Link;
