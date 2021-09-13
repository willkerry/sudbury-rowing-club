import MobileMenu from "@/components/nav-bar/mobile-menu/";
import MobileMenuButton from "@/components/nav-bar/mobile-menu/mobile-menu-button";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import NavPopover from "./nav-popover";
import NavLink from "./nav-link";
import SafetyStatus from "./safety-status";
import NavLogo from "./nav-logo";
import {
  about,
  aboutCTAs,
  regatta,
  regattaCTAs,
  members,
  memberCTAs,
} from "./nav-data";

export default function Navbar() {
  return (
    <Popover className="relative text-gray-900 bg-white">
      {({ open }) => (
        <>
          <div className="max-w-screen-lg px-4 mx-auto sm:px-6">
            <div className="flex items-center justify-between py-6 ">
              <NavLogo />
              <MobileMenuButton />
              <Popover.Group as="nav" className="hidden md:flex">
                <NavPopover label="About" navData={about} ctaData={aboutCTAs} />
                <NavLink href="/news">News</NavLink>
                <NavPopover
                  label="Regatta"
                  navData={regatta}
                  ctaData={regattaCTAs}
                />
              </Popover.Group>
              <Popover.Group
                as="nav"
                className="items-center justify-end hidden md:flex lg:w-0 lg:flex-1"
              >
                <NavLink href="/join">Join</NavLink>
                <NavPopover
                  compact
                  label="Members"
                  navData={members}
                  ctaData={memberCTAs}
                />
                <div className="ml-1">
                  <SafetyStatus />
                </div>
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
            {MobileMenu()}
          </Transition>
        </>
      )}
    </Popover>
  );
}
