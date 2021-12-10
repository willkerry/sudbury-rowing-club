import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const convertBreadcrumb = (string) => {
  return string
    .replace(/-/g, " ")
    .replace(/oe/g, "ö")
    .replace(/ae/g, "ä")
    .replace(/ue/g, "ü");
};

const Breadcrumbs = (props) => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          breadcrumb: path,
          href: "/" + linkPath.slice(0, i + 1).join("/"),
        };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav aria-label="breadcrumbs">
      <ol className={props.listClassName}>
        <li className={props.inactiveItemClassName}>
          <Link href="/">{props.rootLabel}</Link>
        </li>

        {breadcrumbs.map((breadcrumb, i) => {
          return i === breadcrumbs.length - 1 ? (
            <li
              key={breadcrumb.href}
              index={i}
              className={props.activeItemClassName}
            >
              {convertBreadcrumb(breadcrumb.breadcrumb)}
            </li>
          ) : (
            <li
              key={breadcrumb.href}
              index={i}
              className={props.inactiveItemClassName}
            >
              <Link href={breadcrumb.href}>
                <a>{convertBreadcrumb(breadcrumb.breadcrumb)}</a>
              </Link>
            </li>
          );
          e;
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
