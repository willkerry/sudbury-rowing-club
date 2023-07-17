import { useRouter } from "next/router";
import Link from "next/link";
import prettifyBreadcrumb from "./prettifyBreadcrumb";

type Props = {
  listClassName?: string;
  activeItemClassName?: string;
  inactiveItemClassName?: string;
  rootLabel?: string;
};

type Crumb = {
  breadcrumb: string;
  href: string;
};

const getBreadcrumbs = (pathname: string) => {
  const linkPath = pathname.split("/");
  linkPath.shift();

  const pathArray: Crumb[] = linkPath.map((path, i) => ({
    breadcrumb: path,
    href: `/${linkPath.slice(0, i + 1).join("/")}`,
  }));

  return pathArray;
};

const Breadcrumbs = ({
  listClassName,
  activeItemClassName,
  inactiveItemClassName,
  rootLabel = "Home",
}: Props) => {
  const { asPath } = useRouter();
  const breadcrumbs = getBreadcrumbs(asPath);

  if (!breadcrumbs) return null;

  return (
    <nav aria-label="breadcrumbs">
      <ol className={listClassName}>
        <li className={inactiveItemClassName}>
          <Link href="/" legacyBehavior>
            {rootLabel}
          </Link>
        </li>

        {breadcrumbs.map((breadcrumb, i) =>
          i === breadcrumbs.length - 1 ? (
            <li key={breadcrumb.href} className={activeItemClassName}>
              {prettifyBreadcrumb(breadcrumb.breadcrumb)}
            </li>
          ) : (
            <li key={breadcrumb.href} className={inactiveItemClassName}>
              <Link href={breadcrumb.href}>
                {prettifyBreadcrumb(breadcrumb.breadcrumb)}
              </Link>
            </li>
          )
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
