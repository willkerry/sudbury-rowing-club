import NextLink from "next/link";
import cn from "classnames";
import { ArrowRight, Download, ExternalLink } from "react-feather";
import PropTypes from "prop-types";

function Link({
  href,
  children,
  dark,
  external,
  download,
  arrow,
  extension,
  className,
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

Link.propTypes = {
  /**
   * The href of the link.
   */
  href: PropTypes.string.isRequired,
  /**
   * The children of the link. For non-string children, use the regular `next/link`. This component only adds styling.
   * @default "Link"
   * @type {string}
   * @required
   * @example
   * <Link href="/">Home</Link>
   * <Link href="/about">About</Link>
   */
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,

  /**
   * Are we on a dark background?
   * @default false
   * @type {boolean}
   * @optional
   */
  dark: PropTypes.bool,
  /**
   * Is this a link to an external site?
   * @default false
   * @type {boolean}
   */
  external: PropTypes.bool,
  /**
   * Is this a link to a file?
   * @default false
   * @type {boolean}
   * @optional
   */
  download: PropTypes.bool,
  /**
   * Do we want an arrow icon?
   * @default false
   * @type {boolean}
   * @optional
   */
  arrow: PropTypes.bool,
  /**
   * Neatly print the file extension (reserved for `download=true` links).
   * @type {string}
   * @optional
   */
  extension: PropTypes.string,
  /**
   * Optionally add some custom classes.
   * @type {string}
   * @optional
   */
  className: PropTypes.string,
};

Link.defaultProps = {
  dark: false,
  external: false,
  download: false,
  arrow: false,
  extension: null,
  className: null,
};

export default Link;
