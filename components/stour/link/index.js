import NextLink from "next/link";
import cn from "classnames";
import { ArrowRight, Download, ExternalLink } from "react-feather";

function Link({
  href,
  children,
  dark,
  icon,
  external,
  download,
  arrow,
  extension,
  ...props
}) {
  const iconClass = "inline-flex mb-0.5 ml-1";
  return (
    <NextLink href={href} passHref>
      <a
        className={cn(
          dark
            ? "text-blue-100 hover:text-white"
            : "text-blue-500 hover:text-blue-300",
          (external || download) && "relative",
          "transition",
          props.className
        )}
        {...props}
      >
        {children}
        {extension && (
          <span className="px-1 ml-1 text-xs font-medium text-gray-400 uppercase transition border rounded-full">
            {extension}
          </span>
        )}
        {external && <ExternalLink className={iconClass} size="1em" />}
        {download && <Download className={iconClass} size="1em" />}
        {arrow && <ArrowRight className={iconClass} size="1em" />}
      </a>
    </NextLink>
  );
}

export default Link;
