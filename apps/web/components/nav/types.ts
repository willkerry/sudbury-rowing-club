import type React from "react";

type NavigationIcon =
  | React.FC<React.SVGProps<SVGSVGElement>>
  | React.ForwardRefExoticComponent<
      React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
        title?: string;
        titleId?: string;
      } & React.RefAttributes<SVGSVGElement>
    >;

export type NavigationItem = {
  name: string;
  description?: string;
  shortName?: string;
  href: string;
  mobileOnly?: boolean;
  cta?: boolean;
  icon?: NavigationIcon;
  items?: Omit<NavigationItem, "icon" | "items">[];
};

export type NavigationGroup = {
  title: string;
  icon?: NavigationIcon;
  items: NavigationItem[];
};
