import { PopoverButton } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";

const MobileMenuButton = () => (
  <div className="-my-2 -mr-2 sm:hidden">
    <PopoverButton className="text-gray-40 inline-flex items-center justify-center rounded-md p-2 transition hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
      <span className="sr-only">Open menu</span>
      <Bars3Icon className="h-6 w-6" aria-hidden />
    </PopoverButton>
  </div>
);

export default MobileMenuButton;
