import cn from "classnames";
import { CompactMobileMenuItem, MobileMenuItem } from "./mobile-menu-item";

export default function MobileMenuSection({ title, data, compact }) {
  const MenuItemList = (props) =>
    props.listData.map((item) =>
      compact ? (
        <CompactMobileMenuItem data={item} />
      ) : (
        <MobileMenuItem data={item} />
      )
    );
  return (
    <div className="px-5 pt-4 pb-6">
      <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {title}
      </div>
      <div className="mt-3">
        <nav
          className={cn(
            "grid grid-cols-2 sm:grid-cols-6",
            compact ? "gap-y-2 gap-x-6" : "gap-y-4 gap-x-6"
          )}
        >
          <MenuItemList listData={data} />
        </nav>
      </div>
    </div>
  );
}
