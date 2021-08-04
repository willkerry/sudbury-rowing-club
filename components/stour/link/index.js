import NextLink from "next/link";
import cn from "classnames";
import { DownloadIcon, ExternalLinkIcon } from "@heroicons/react/outline";

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
  const iconClass = "inline-flex self-center w-4 h-4 mb-1 ml-1";
  return (
    <NextLink href={href}>
      <a
        className={cn(
          dark
            ? "text-blue-100 hover:text-white"
            : "text-blue-500 hover:text-blue-300",
          icon && "inline-flex align-baseline",
          "transition",
          className
        )}
        {...props}
      >
        {children}
        {icon && <ExternalLinkIcon className={iconClass} />}
        {external && <ExternalLinkIcon className={iconClass} />}
        {download && <DownloadIcon className={iconClass} />}
      </a>
    </NextLink>
  );
}

export default Link;
