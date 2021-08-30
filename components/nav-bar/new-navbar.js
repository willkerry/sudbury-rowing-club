import Logo from "@/components/logo/";
import MobileMenu from "@/components/nav-bar/mobile-menu/";
import { Button as StourButton } from "@/components/stour/button";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { Fragment } from "react";
import { Users } from "react-feather";
import NavPopover from "./nav-popover";
import NavLink from "./nav-link";
import SafetyStatus from "./safety-status";
import {
  about,
  aboutCTAs,
  regatta,
  regattaCTAs,
  members,
  memberCTAs,
} from "./nav-data";

export default function Navbar() {
  const mobileMenuButton = (
    <div className="-my-2 -mr-2 md:hidden">
      <Popover.Button className="inline-flex items-center justify-center p-2 transition rounded-md text-gray-40 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
        <span className="sr-only">Open menu</span>
        <MenuIcon className="w-6 h-6" aria-hidden="true" />
      </Popover.Button>
    </div>
  );
  const navbarLogo = (
    <div className="flex justify-start text-blue-800 lg:w-0 lg:flex-1">
      <Link href="/">
        <a>
          <span className="sr-only">Sudbury Rowing Club</span>
          <Logo className="w-auto h-8 sm:h-10" />
        </a>
      </Link>
    </div>
  );
  return (
    <Popover className="relative text-gray-900 bg-white">
      {({ open }) => (
        <>
          <div className="max-w-screen-lg px-4 mx-auto sm:px-6">
            <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
              {navbarLogo}
              {mobileMenuButton}
              <Popover.Group
                as="nav"
                className="hidden md:space-x-3 lg:space-x-6 md:flex"
              >
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
                className="items-center justify-end hidden space-x-4 md:flex md:flex-1 lg:w-0"
              >
                <SafetyStatus />
                <NavPopover
                  compact
                  icon={Users}
                  label="Members"
                  navData={members}
                  ctaData={memberCTAs}
                />
                <div className="hidden md:flex">
                  <StourButton size="auto" href="/join">
                    Join<span className="hidden lg:inline"> us</span>
                  </StourButton>
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
