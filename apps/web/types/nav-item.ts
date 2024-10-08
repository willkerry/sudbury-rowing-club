import type React from "react";

export type NavItemType = {
  name: string;
  description?: string;
  shortName?: string;
  href: string;
  mobileOnly?: boolean;
  cta?: boolean;
};

export interface IconNavItemType extends NavItemType {
  icon?:
    | React.FC<React.SVGProps<SVGSVGElement>>
    | React.ForwardRefExoticComponent<
        React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
          title?: string;
          titleId?: string;
        } & React.RefAttributes<SVGSVGElement>
      >;
}
export default NavItemType;
