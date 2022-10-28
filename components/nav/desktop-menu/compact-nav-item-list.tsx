import Link from "next/link";
import { type NavItemType } from "@/types/nav-item";

type Props = { items: NavItemType[] };

const CompactNavItemList = ({ items }: Props) => {
  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-start p-2.5 -m-2.5 text-sm font-medium text-gray-900 transition border border-transparent rounded hover:bg-gray-50 hover:border-gray-100"
        >
          <div className="whitespace-nowrap">{item.name}</div>
        </Link>
      ))}
    </>
  );
};

export default CompactNavItemList;
