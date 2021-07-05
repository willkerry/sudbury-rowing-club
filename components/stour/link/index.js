import NextLink from "next/link";
import cn from "classnames";
import { ExternalLinkIcon } from "@heroicons/react/outline";

function Link({ href, children, dark, icon, className, ...props }) {
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
          {icon && (
            <ExternalLinkIcon className="inline-flex self-center w-4 h-4 mx-1" />
          )}
        </a>
      </NextLink>
  );
}

export default Link;
