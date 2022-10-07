import Link from "next/link";
import { type IconNavItemType } from "@/types/nav-item";

type Props = { items: IconNavItemType[] };

const NavItemList = ({ items }: Props) => {
  return (
    <>
      {items.map(
        (item) =>
          !item.mobileOnly && (
            <Link key={item.href} href={item.href} passHref>
              <a className="flex items-start p-3 -m-3 rounded hover:bg-gray-100">
                {item.icon && (
                  <item.icon
                    className="flex-shrink-0 w-6 h-6 text-blue-700"
                    aria-hidden="true"
                  />
                )}
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  )}
                </div>
              </a>
            </Link>
          )
      )}
    </>
  );
};

export default NavItemList;
