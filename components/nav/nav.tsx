import { NavLink, NavLogo, NavSection } from "@/components/nav";
import {
  MobileMenuButton,
  CompactMobileMenuSection,
  MobileMenuSection,
} from "@/components/nav/mobile-menu";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Users } from "react-feather";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { IconNavItemType } from "../../types/nav-item";
import {
  about,
  aboutCTAs,
  memberCTAs,
  members,
  regatta,
  regattaCTAs,
} from "./nav-data";

const Nav = () => (
  <Popover className="bg-white text-gray-900" id="navbar">
    {({ open }) => (
      <>
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6">
          <div className="xs:py-4 flex items-center justify-between py-3 md:py-6 ">
            <NavLogo />
            <MobileMenuButton />

            <Popover.Group as="nav" className="mx-auto hidden sm:flex">
              <NavSection label="About" items={[...about, ...aboutCTAs]} />
              <NavLink href="/news">News</NavLink>
              <NavSection
                label="Regatta"
                items={[...regatta, ...regattaCTAs]}
              />
            </Popover.Group>

            <Popover.Group
              as="nav"
              className="hidden items-center justify-end sm:flex lg:w-0 lg:flex-1 "
            >
              <NavLink href="/join">Join</NavLink>
              <NavSection
                compact
                icon={<Users className="flex h-4 w-4" />}
                altLabel="Members"
                items={[...(members as IconNavItemType[]), ...memberCTAs]}
              />
            </Popover.Group>
          </div>
        </div>

        <Transition
          show={open}
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            static
            className="absolute inset-x-0 top-0 z-20 origin-top-right transform p-2 transition md:hidden"
          >
            <div className="relative divide-y rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <MobileMenuSection title="About" data={about.concat(aboutCTAs)} />
              <MobileMenuSection
                collapse
                title="Regatta"
                data={regatta.concat(regattaCTAs)}
              />
              <CompactMobileMenuSection
                title="Members"
                data={members.concat(memberCTAs)}
              />
            </div>
            <div className="absolute right-3 top-3">
              <Popover.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>
          </Popover.Panel>
        </Transition>
      </>
    )}
  </Popover>
);

export default Nav;
