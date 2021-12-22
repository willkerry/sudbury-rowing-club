import cn from "classnames";
import PropTypes from "prop-types";
import ActiveLink from "./active-link";
import {
  navLinkActiveColor,
  navLinkClasses,
  navLinkColor,
} from "./nav-popover";

export default function NavLink({ href, children }) {
  return (
    <ActiveLink href={href} activeClassName={navLinkActiveColor} passHref>
      <a className={cn(navLinkClasses, navLinkColor)}>{children}</a>
    </ActiveLink>
  );
}
NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
