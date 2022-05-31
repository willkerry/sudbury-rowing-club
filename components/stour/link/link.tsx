import NextLink from "next/link";
import cn from "classnames";
import { ArrowRight, Download, ExternalLink } from "react-feather";

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

const Link = ({
  href,
  children,
  dark = false,
  external = false,
  download = false,
  arrow = false,
  extension,
  className,
}: Props) => (
  <NextLink href={href} passHref>
    <a
      className={cn(
        dark
          ? "text-blue-100 hover:text-white"
          : "text-blue-500 hover:text-blue-300",
        (external || download) && "relative",
        "transition",
        className
      )}
    >
      {children}
      {extension && (
        <span className="px-1 ml-1 text-xs font-medium text-gray-400 uppercase transition border rounded-full">
          {extension}
        </span>
      )}
      {external && (
        <ExternalLink className="inline-flex mb-0.5 ml-1" size="1em" />
      )}
      {download && <Download className="inline-flex mb-0.5 ml-1" size="1em" />}
      {arrow && <ArrowRight className="inline-flex mb-0.5 ml-1" size="1em" />}
    </a>
  </NextLink>
);

export default Link;
