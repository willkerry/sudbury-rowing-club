import Link from "next/link";
import { type IconNavItemType, type NavItemType } from "@/types/nav-item";

const MobileMenuItem = ({ data }: { data: IconNavItemType }) => (
  <Link
    key={data.name}
    href={data.href}
    className="flex items-center p-2 -m-2 roun dded-md hover:bg-gray-100"
  >
    <data.icon
      className="flex-shrink-0 w-5 h-5 text-blue-700"
      aria-hidden="true"
    />
    <span className="ml-1.5 font-medium text-gray-900">
      {data.shortName ? data.shortName : data.name}
    </span>
  </Link>
);

const CompactMobileMenuItem = ({ data }: { data: NavItemType }) => (
  <Link
    key={data.name}
    href={data.href}
    className="flex items-center p-2 -m-2 rounded-md hover:bg-gray-100"
  >
    <span className="text-sm font-medium text-gray-700">
      {data.shortName ? data.shortName : data.name}
    </span>
  </Link>
);

export { MobileMenuItem, CompactMobileMenuItem };
