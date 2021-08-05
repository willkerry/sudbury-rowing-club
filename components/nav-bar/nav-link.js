import cn from "classnames";
import ActiveLink from "./active-link";
import {
  navLinkActiveColor,
  navLinkClasses,
  navLinkColor,
} from "./nav-popover";

export function NavLink(props) {
  return (
    <ActiveLink href={props.href} activeClassName={navLinkActiveColor}>
      <a className={cn(navLinkClasses, navLinkColor)}>{props.children}</a>
    </ActiveLink>
  );
}

export default NavLink;
