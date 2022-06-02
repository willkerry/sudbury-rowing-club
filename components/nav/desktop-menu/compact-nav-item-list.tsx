import Link from "next/link";
import { type NavItemType } from "@/types/nav-item";

type Props = { items: NavItemType[] };

const CompactNavItemList = ({ items }: Props) => {
  return (
    <>
      {items.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <a className="flex items-start p-2 -m-2 text-sm font-medium text-gray-900 rounded hover:bg-gray-100">
            <div className="whitespace-nowrap">{item.name}</div>
          </a>
        </Link>
      ))}
    </>
  );
};

export default CompactNavItemList;
