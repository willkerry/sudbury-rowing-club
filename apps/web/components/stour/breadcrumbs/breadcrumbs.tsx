"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { unique } from "radashi";
import { prettifyBreadcrumb } from "./prettifyBreadcrumb";

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
  const [cleanPathname] = pathname.split("?");

  const linkPath = cleanPathname.split("/");
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

const abridgeBreadcrumbs = (breadcrumbs: Crumb[]): Crumb[] => {
  const getTotalCharacterLength = () =>
    breadcrumbs.reduce((acc, crumb) => acc + crumb.breadcrumb.length, 0);

  for (const i of Array.from({ length: breadcrumbs.length }, (_, i) => i)) {
    if (getTotalCharacterLength() <= 50) {
      break;
    }

    if (i === 0) {
      continue;
    }

    if (i > 1 && breadcrumbs[i - 1].breadcrumb === "") {
      breadcrumbs.splice(i, 1);
      continue;
    }

    breadcrumbs[i] = {
      breadcrumb: "",
      href: "#",
    };
  }

  return unique(breadcrumbs, (crumb) => crumb.href);
};

export const Breadcrumbs = ({
  listClassName,
  activeItemClassName,
  inactiveItemClassName,
  rootLabel = "Home",
  currentLabel,
}: Props) => {
  const asPath = usePathname();

  if (!asPath) return null;

  const breadcrumbs = getBreadcrumbs(asPath, currentLabel);

  if (!breadcrumbs) return null;

  const abridgedBreadcrumbs = abridgeBreadcrumbs(breadcrumbs);

  return (
    <nav aria-label="breadcrumbs">
      <ol className={listClassName}>
        <li className={inactiveItemClassName}>
          <Link href="/">{rootLabel}</Link>
        </li>

        {abridgedBreadcrumbs.map((breadcrumb, i) => {
          if (i === abridgedBreadcrumbs.length - 1) {
            return (
              <li
                aria-current="page"
                className={activeItemClassName}
                key={breadcrumb.href}
              >
                {prettifyBreadcrumb(breadcrumb.breadcrumb)}
              </li>
            );
          }

          if (breadcrumb.breadcrumb === "") {
            return (
              <li className={inactiveItemClassName} key={breadcrumb.href}>
                &hellip;
              </li>
            );
          }

          return (
            <li className={inactiveItemClassName} key={breadcrumb.href}>
              <Link href={breadcrumb.href}>
                {prettifyBreadcrumb(breadcrumb.breadcrumb)}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
