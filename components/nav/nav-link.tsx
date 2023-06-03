import cn from "classnames";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/router";
import {
  navLinkActive,
  navLinkClasses,
  navLinkColor,
} from "./desktop-menu/nav-section";

type Props = LinkProps & {
  children: React.ReactNode;
};

const NavLink = ({ href, children }: Props) => {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={cn(
        router.asPath === href ? navLinkActive : navLinkColor,
        navLinkClasses
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
