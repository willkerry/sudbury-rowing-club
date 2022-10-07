import { Popover } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";

const MobileMenuButton = () => (
  <div className="-my-2 -mr-2 sm:hidden">
    <Popover.Button className="inline-flex items-center justify-center p-2 transition rounded-md text-gray-40 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
      <span className="sr-only">Open menu</span>
      <Bars3Icon className="w-6 h-6" aria-hidden="true" />
    </Popover.Button>
  </div>
);

export default MobileMenuButton;
