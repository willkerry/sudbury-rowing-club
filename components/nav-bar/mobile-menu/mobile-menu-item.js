import Link from "next/link";

export function MobileMenuItem({ data }) {
  return (
    <Link key={data.name} href={data.href}>
      <a className="flex items-center p-1 -m-1 rounded-md hover:bg-gray-50">
        <data.icon
          className="flex-shrink-0 w-4 h-4 text-blue-700"
          aria-hidden="true"
        />
        <span className="ml-1.5 text-sm font-medium text-gray-900">
          {data.shortName ? data.shortName : data.name}
        </span>
      </a>
    </Link>
  );
}
export function CompactMobileMenuItem({ data }) {
  return (
    <Link key={data.name} href={data.href}>
      <a className="flex items-center p-1.5 -m-1.5 rounded-md hover:bg-gray-50">
        <span className="text-xs font-medium text-gray-700">
          {data.shortName ? data.shortName : data.name}
        </span>
      </a>
    </Link>
  );
}
