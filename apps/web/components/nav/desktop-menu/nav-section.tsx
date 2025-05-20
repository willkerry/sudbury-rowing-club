"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { IconNavItemType } from "@/types/nav-item";
import { usePathname } from "next/navigation";
import { fork } from "radash";

export const navLinkClasses = cn(
  "group inline-flex rounded-md px-2 py-2.5 text-sm transition hover:text-black md:px-3",
);
export const navLinkColor = "text-gray-500 font-medium";
export const navLinkActive = "text-black font-medium";

const POPOVER_PANEL_CLASSES = new Map<boolean, string>([
  [true, "max-w-sm right-0"],
  [false, "w-screen max-w-xs -translate-x-1/2 left-1/2"],
]);

type NavSectionProps = {
  compact?: boolean;
  icon?: React.ReactElement;
  items: IconNavItemType[];
  label?: string;
};

const NavSection = ({
  compact = false,
  icon,
  items,
  label,
}: NavSectionProps) => {
  const pathname = usePathname();
  const isActive = items.some(({ href }) => pathname === href);

  if (items.length === 1) {
    const { href, name } = items[0];
    return (
      <NavigationMenuLink
        href={href}
        className={cn(isActive ? navLinkActive : navLinkColor, navLinkClasses)}
      >
        {name}
      </NavigationMenuLink>
    );
  }

  const [primaryItems, ctaItems] = fork(items, ({ cta }) => !cta);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              isActive ? navLinkActive : navLinkColor,
              navLinkClasses,
              "items-center",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span className={cn(icon && "sr-only")}>{label}</span>
            {icon}
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className={cn(POPOVER_PANEL_CLASSES.get(compact))}
          >
            <div className="overflow-hidden rounded-md bg-gray-200 bg-opacity-75 p-1 shadow-lg backdrop-blur-sm">
              <div className="relative grid gap-4 rounded-xs bg-white p-2 shadow-sm">
                {primaryItems.map((item) => (
                  <NavigationMenuLink
                    key={item.href}
                    href={item.href}
                    className="group flex rounded-sm transition"
                  >
                    {item.icon && (
                      <item.icon
                        className="mr-2.5 h-6 w-6 shrink-0 text-blue-700 transition-colors group-hover:text-blue-500"
                        aria-hidden
                      />
                    )}
                    <div className="flex flex-col">
                      <p
                        className={cn(
                          "flex py-0.5 font-semibold text-sm leading-none transition-colors",
                          {
                            "text-gray-900 group-hover:text-gray-700": item.cta,
                            "text-gray-600 group-hover:text-gray-900":
                              !item.cta,
                          },
                        )}
                      >
                        {item.name}
                        {!item.cta && (
                          <span
                            aria-hidden
                            className="block scale-y-90 opacity-0 transition group-hover:translate-x-1 group-hover:scale-x-110 group-hover:opacity-100"
                          >
                            &rarr;
                          </span>
                        )}
                      </p>
                      {item.description && (
                        <p className="font-medium text-gray-500 text-xs transition-colors group-hover:text-gray-900">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </NavigationMenuLink>
                ))}
              </div>

              <div
                className={cn(
                  "pt-3 pb-2",
                  compact
                    ? "space-y-4 pr-4 pl-3"
                    : "flex space-x-6 space-y-0 px-2",
                )}
              >
                {ctaItems.map((item) => (
                  <NavigationMenuLink
                    key={item.href}
                    href={item.href}
                    className="group flex rounded-sm transition"
                  >
                    {item.icon && (
                      <item.icon
                        className="mr-2.5 h-6 w-6 shrink-0 text-blue-700 transition-colors group-hover:text-blue-500"
                        aria-hidden
                      />
                    )}
                    <div className="flex flex-col">
                      <p
                        className={cn(
                          "flex py-0.5 font-semibold text-sm leading-none transition-colors",
                          {
                            "text-gray-900 group-hover:text-gray-700": item.cta,
                            "text-gray-600 group-hover:text-gray-900":
                              !item.cta,
                          },
                        )}
                      >
                        {item.name}
                        {!item.cta && (
                          <span
                            aria-hidden
                            className="block scale-y-90 opacity-0 transition group-hover:translate-x-1 group-hover:scale-x-110 group-hover:opacity-100"
                          >
                            &rarr;
                          </span>
                        )}
                      </p>
                      {item.description && (
                        <p className="font-medium text-gray-500 text-xs transition-colors group-hover:text-gray-900">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
      <NavigationMenuViewport />
    </NavigationMenu>
  );
};

export default NavSection;
