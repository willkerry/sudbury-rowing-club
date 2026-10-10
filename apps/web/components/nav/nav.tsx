"use client";

import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import {
  MobileMenuButton,
  MobileMenuSection,
} from "@/components/nav/mobile-menu";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavSection } from "./desktop-menu/nav-section";
import { JoinLink } from "./join-link";
import { navigationGroups } from "./nav-data";
import { NavLogo } from "./nav-logo";

export const Nav = () => (
  <Dialog.Root>
    <div className="bg-white text-gray-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4! py-3 xs:py-4 md:py-6">
        <NavLogo />
        <MobileMenuButton />

        <NavigationMenu
          align="center"
          className="mx-auto hidden flex-none sm:flex"
          popupClassName="rounded-md bg-gray-200 shadow-lg ring-0"
        >
          <NavigationMenuList>
            {navigationGroups.map(({ title, items, compact }) => (
              <NavSection
                compact={compact}
                items={items}
                key={title}
                label={title}
              />
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center justify-end sm:flex lg:w-0 lg:flex-1">
          <JoinLink />
        </div>
      </div>
    </div>

    <Dialog.Portal>
      <Dialog.Popup className="fixed inset-x-0 top-0 z-50 max-h-dvh origin-top-right overflow-y-auto p-2 transition-[opacity,scale] duration-200 ease-out-strong data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100 sm:hidden">
        <Dialog.Title className="sr-only">Menu</Dialog.Title>
        <div className="relative divide-y rounded-sm bg-white shadow-lg">
          {navigationGroups.map(({ title, items, compact }) => (
            <MobileMenuSection
              collapse={title.toLowerCase() === "regatta"}
              compact={compact}
              data={items}
              key={title}
              title={title}
            />
          ))}

          <div className="px-5 py-4">
            <Dialog.Close
              nativeButton={false}
              render={<JoinLink size="default" />}
            />
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <Dialog.Close className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500">
            <span className="sr-only">Close menu</span>
            <XIcon aria-hidden className="h-6 w-6" strokeWidth={1.5} />
          </Dialog.Close>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);
