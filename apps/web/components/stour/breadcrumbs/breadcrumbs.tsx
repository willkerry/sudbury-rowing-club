import Link from "next/link";
import { useRouter } from "next/router";
import prettifyBreadcrumb from "./prettifyBreadcrumb";

type Props = {
  listClassName?: string;
  activeItemClassName?: string;
  inactiveItemClassName?: string;
  rootLabel?: string;
  currentLabel?: string;
};

type Crumb = {
  breadcrumb: string;
  href: string;
};

const getBreadcrumbs = (pathname: string, overrideLastItem?: string) => {
  const linkPath = pathname.split("/");
  linkPath.shift();

  const pathArray: Crumb[] = linkPath.map((path, i) => ({
    breadcrumb: path,
    href: `/${linkPath.slice(0, i + 1).join("/")}`,
  }));

  if (overrideLastItem) {
    pathArray.pop();
    pathArray.push({
      breadcrumb: overrideLastItem,
      href: pathname,
    });
  }

  return pathArray;
};

const Breadcrumbs = ({
  listClassName,
  activeItemClassName,
  inactiveItemClassName,
  rootLabel = "Home",
  currentLabel,
}: Props) => {
  const { asPath } = useRouter();
  const breadcrumbs = getBreadcrumbs(asPath, currentLabel);

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
          ),
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
