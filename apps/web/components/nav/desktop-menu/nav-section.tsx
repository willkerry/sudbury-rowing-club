"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { fork } from "radashi";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { IconNavItemType } from "@/types/nav-item";

const navLinkClasses = (isActive: boolean) =>
  cn(
    navigationMenuTriggerStyle(),
    "h-auto px-2 py-2.5 text-gray-500 transition-colors hover:bg-transparent hover:text-black focus:bg-transparent focus-visible:ring-2 focus-visible:ring-blue-500 data-open:bg-transparent data-popup-open:bg-transparent data-open:text-black data-popup-open:text-black data-open:focus:bg-transparent data-open:hover:bg-transparent data-popup-open:hover:bg-transparent md:px-3 [&>svg]:text-gray-400 hover:[&>svg]:text-gray-800",
    isActive && "text-black [&>svg]:text-gray-700",
  );

const ListItem = ({
  href,
  name,
  description,
  icon,
  mobileOnly,
  cta,
}: IconNavItemType) => {
  if (mobileOnly) return null;

  const Icon = icon || null;

  return (
    <NavigationMenuLink
      className={cn(
        "group gap-2.5 transition-colors hover:bg-transparent focus:bg-transparent",
        description ? "items-start" : "items-center",
      )}
      closeOnClick
      render={<Link href={href} />}
    >
      {Icon && (
        <Icon
          aria-hidden
          className="size-6 shrink-0 text-blue-700 transition-colors group-hover:text-blue-500"
          strokeWidth={1.5}
        />
      )}
      <div className="flex flex-col">
        <p
          className={cn(
            "flex py-0.5 font-semibold text-sm leading-none transition-colors",
            {
              "text-gray-600 group-hover:text-gray-900": !cta,
              "text-gray-900 group-hover:text-gray-700": cta,
            },
          )}
        >
          {name}
          {!cta && (
            <span
              aria-hidden
              className="block scale-y-90 opacity-0 transition group-hover:translate-x-1 group-hover:scale-x-110 group-hover:opacity-100"
            >
              &rarr;
            </span>
          )}
        </p>
        {description && (
          <p className="font-medium text-gray-500 text-xs transition-colors group-hover:text-gray-900">
            {description}
          </p>
        )}
      </div>
    </NavigationMenuLink>
  );
};

type NavSectionProps = {
  compact?: boolean;
  items: IconNavItemType[];
  label?: string;
};

export const NavSection = ({
  compact = false,
  items,
  label,
}: NavSectionProps) => {
  const pathname = usePathname();
  const isActive = items.some(({ href }) => pathname === href);

  if (items.length === 1) {
    const { href, name } = items[0];

    return (
      <NavigationMenuItem>
        <NavigationMenuLink
          active={isActive}
          className={navLinkClasses(isActive)}
          render={<Link href={href} />}
        >
          {name}
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  const [primaryItems, ctaItems] = fork(items, ({ cta }) => !cta);

  return (
    <NavigationMenuItem value={label}>
      <NavigationMenuTrigger className={navLinkClasses(isActive)}>
        {label}
      </NavigationMenuTrigger>

      <NavigationMenuContent
        className={cn("p-1", compact ? "w-max max-w-sm" : "w-xs")}
      >
        <div className="grid rounded-xs bg-white p-1 shadow-sm">
          {primaryItems.map((item) => (
            <ListItem key={item.href} {...item} />
          ))}
        </div>

        <div className={cn("py-1", compact ? "grid px-1" : "flex gap-2 px-1")}>
          {ctaItems.map((item) => (
            <ListItem key={item.href} {...item} />
          ))}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
