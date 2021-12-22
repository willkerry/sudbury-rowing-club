import Link from "next/link";
import PropTypes from "prop-types";

export function MobileMenuItem({ data }) {
  return (
    <Link key={data.name} href={data.href}>
      <a className="flex items-center p-2 -m-2 rounded-md hover:bg-gray-100">
        <data.icon
          className="flex-shrink-0 w-5 h-5 text-blue-700"
          aria-hidden="true"
        />
        <span className="ml-1.5 font-medium text-gray-900">
          {data.shortName ? data.shortName : data.name}
        </span>
      </a>
    </Link>
  );
}
MobileMenuItem.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string,
    href: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
  }).isRequired,
};

export function CompactMobileMenuItem({ data }) {
  return (
    <Link key={data.name} href={data.href}>
      <a className="flex items-center p-2 -m-2 rounded-md hover:bg-gray-100">
        <span className="text-sm font-medium text-gray-700">
          {data.shortName ? data.shortName : data.name}
        </span>
      </a>
    </Link>
  );
}
CompactMobileMenuItem.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string,
    href: PropTypes.string.isRequired,
  }).isRequired,
};
