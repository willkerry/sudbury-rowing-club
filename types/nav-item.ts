import { Icon } from "react-feather";

export type NavItemType = {
    name: string;
    description?: string;
    shortName?: string;
    href: string;
    mobileOnly?: boolean;
};

export interface IconNavItemType extends NavItemType {
    icon: Icon;
}
export default NavItemType;

