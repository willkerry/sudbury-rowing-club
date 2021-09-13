import { Popover } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { MobileMenuSection } from "./mobile-menu-section";
import { about, regatta, members } from "@/components/nav-bar/nav-data";

export default function MobileMenu() {
  const mobileMenuCloseButton = (
    <div className="absolute top-3 right-3">
      <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-700 transition rounded-md hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
        <span className="sr-only">Close menu</span>
        <XIcon className="w-6 h-6" aria-hidden="true" />
      </Popover.Button>
    </div>
  );
  return (
    <Popover.Panel
      focus
      static
      className="absolute inset-x-0 top-0 z-20 p-2 transition origin-top-right transform md:hidden"
    >
      <div className="relative bg-white divide-y rounded shadow-lg ring-1 ring-black ring-opacity-5">
        <MobileMenuSection title="About" data={about} />
        <MobileMenuSection title="Regatta" data={regatta} />
        <MobileMenuSection title="Members" data={members} compact="true" />
      </div>
      {mobileMenuCloseButton}
    </Popover.Panel>
  );
}
