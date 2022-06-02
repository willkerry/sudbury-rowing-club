import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import cn from "classnames";
import { Users } from "react-feather";
import MobileMenuButton from "@/components/nav/mobile-menu/mobile-menu-button";
import MobileMenu from "@/components/nav/mobile-menu/";
import {
  about,
  aboutCTAs,
  memberCTAs,
  members,
  regatta,
  regattaCTAs,
} from "./nav-data";
import NavLink from "./nav-link";
import NavLogo from "./nav-logo";
import NavPopover from "./nav-popover";

export default function Nav() {
  // Add a border to the navbar when the user scrolls down
  const [navbarBorder, setNavbarBorder] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setNavbarBorder(true);
      } else {
        setNavbarBorder(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Popover
      className={cn(
        "sticky top-0 z-20 text-gray-900 transition bg-white",
        navbarBorder && "border-b"
      )}
      id="navbar"
    >
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
                  label={<Users className="flex w-4 h-4" />}
                  altLabel="Members"
                  navData={members}
                  ctaData={memberCTAs}
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
            {MobileMenu()}
          </Transition>
        </>
      )}
    </Popover>
  );
}
