import NextLink from "next/link";
import cn from "classnames";
import { Download, ExternalLink } from "react-feather";

function Link({
  href,
  children,
  dark,
  icon,
  external,
  download,
  className,
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
          className
        )}
        {...props}
      >
        {children}
        {external && <ExternalLink className={iconClass} size="1em" />}
        {download && <Download className={iconClass} size="1em" />}
      </a>
    </NextLink>
  );
}

export default Link;
