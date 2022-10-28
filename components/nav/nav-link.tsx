import cn from "classnames";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import {
  navLinkActive,
  navLinkClasses,
  navLinkColor,
} from "./desktop-menu/nav-section";

type Props = LinkProps & {
  children: React.ReactNode;
};

const NavLink = ({ href, children }: Props) => {
  const path = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        path === href && navLinkActive,
        navLinkClasses,
        navLinkColor
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
