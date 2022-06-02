import cn from "classnames";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/router";
import {
  navLinkActiveColor,
  navLinkClasses,
  navLinkColor,
} from "./desktop-menu/nav-section";

type Props = LinkProps & {
  children: React.ReactNode;
};

const NavLink = ({ href, children }: Props) => {
  const router = useRouter();
  return (
    <Link href={href} passHref>
      <a
        className={cn(
          router.asPath == href && navLinkActiveColor,
          navLinkClasses,
          navLinkColor
        )}
      >
        {children}
      </a>
    </Link>
  );
};

export default NavLink;