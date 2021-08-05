import { Popover } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { MobileMenuSection } from "./mobile-menu-section";
import { about, regatta, members } from "@/components/nav-bar/nav-data";

export default function MobileMenu() {
  const mobileMenuCloseButton = (
    <div className="absolute top-0 right-0 div">
      <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sudbury">
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
      <div className="relative bg-white divide-y rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
        <MobileMenuSection title="About" data={about} />
        <MobileMenuSection title="Regatta" data={regatta} />
        <MobileMenuSection title="Members" data={members} compact="true" />
        {mobileMenuCloseButton}
      </div>
    </Popover.Panel>
  );
}
