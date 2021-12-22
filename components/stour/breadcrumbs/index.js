import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Link from "next/link";

const convertBreadcrumb = (string) =>
  string
    .replace(/-/g, " ")
    .replace(/oe/g, "ö")
    .replace(/ae/g, "ä")
    .replace(/ue/g, "ü");

function Breadcrumbs({
  listClassName,
  activeItemClassName,
  inactiveItemClassName,
  rootLabel,
}) {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => ({
        breadcrumb: path,
        href: `/${linkPath.slice(0, i + 1).join("/")}`,
      }));

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav aria-label="breadcrumbs">
      <ol className={listClassName}>
        <li className={inactiveItemClassName}>
          <Link href="/">{rootLabel}</Link>
        </li>

        {breadcrumbs.map((breadcrumb, i) =>
          i === breadcrumbs.length - 1 ? (
            <li key={breadcrumb.href} index={i} className={activeItemClassName}>
              {convertBreadcrumb(breadcrumb.breadcrumb)}
            </li>
          ) : (
            <li
              key={breadcrumb.href}
              index={i}
              className={inactiveItemClassName}
            >
              <Link href={breadcrumb.href}>
                <a>{convertBreadcrumb(breadcrumb.breadcrumb)}</a>
              </Link>
            </li>
          )
        )}
      </ol>
    </nav>
  );
}

Breadcrumbs.propTypes = {
  listClassName: PropTypes.string,
  activeItemClassName: PropTypes.string,
  inactiveItemClassName: PropTypes.string,
  rootLabel: PropTypes.string,
};

Breadcrumbs.defaultProps = {
  listClassName: null,
  activeItemClassName: null,
  inactiveItemClassName: null,
  rootLabel: "Homes",
};

export default Breadcrumbs;
