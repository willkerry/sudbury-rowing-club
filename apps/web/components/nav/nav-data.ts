import { CalendarIcon } from "@heroicons/react/20/solid";
import {
  EnvelopeIcon,
  FlagIcon,
  InformationCircleIcon,
  MapPinIcon,
  NewspaperIcon,
  PhotoIcon,
  ShieldCheckIcon,
  TicketIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Facebook, Instagram } from "lucide-react";
import { SOCIALS } from "@/lib/constants";
import {
  Governance,
  History,
  MyClubhouse,
  Results,
  Safety,
  Spond,
} from "@/components/icons";
import { IconNavItemType } from "@/types/nav-item";

type NavigationGroup = {
  title: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  items: IconNavItemType[];
};

const navigationGroups: NavigationGroup[] = [
  {
    title: "About",
    items: [
      {
        name: "History",
        description: "Rowing in Sudbury since 1874.",
        href: "/about/history",
        icon: History,
      },
      {
        name: "Safety",
        description: "Your safety is our top priority.",
        href: "/safety",
        icon: Safety,
      },
      {
        name: "Governance",
        description: "How our club is organised.",
        href: "/governance",
        icon: Governance,
      },
      {
        name: "How to find us",
        shortName: "Find us",
        href: "/contact/how-to-find-us",
        icon: MapPinIcon,
        cta: true,
      },
      {
        name: "Contact",
        href: "/contact",
        icon: EnvelopeIcon,
        cta: true,
      },
    ],
  },
  {
    title: "News",
    items: [
      {
        name: "News",
        href: "/news",
        icon: NewspaperIcon,
      },
    ],
  },
  {
    title: "Regatta",
    items: [
      {
        name: "The ‘International’",
        shortName: "About",
        description:
          "Learn everything you need to know about Sudbury’s ’Little Henley‘.",
        href: "/regatta",
        icon: InformationCircleIcon,
      },
      {
        name: "Results",
        href: "/regatta/results",
        icon: Results,
      },
      {
        name: "Entries",
        href: "/regatta/entries",
        icon: TicketIcon,
      },
      {
        name: "Course Map",
        shortName: "Course",
        href: "/regatta/course",
        icon: FlagIcon,
      },
      {
        name: "Official Photography",
        shortName: "Photography",
        href: "/regatta/galleries",
        icon: PhotoIcon,
      },
      {
        name: "Competitor information",
        shortName: "Competitors",
        href: "/regatta/competitor-information",
        icon: ShieldCheckIcon,
      },
      {
        name: "Find the regatta",
        shortName: "Find",
        href: "/contact/how-to-find-us",
        icon: MapPinIcon,
        cta: true,
      },
    ],
  },
];

const secondaryNavigationGroups: NavigationGroup[] = [
  {
    title: "Join",
    items: [
      {
        name: "Join",
        href: "/join",
        icon: UserPlusIcon,
      },
    ],
  },
  {
    title: "Members",
    items: [
      {
        name: "Notices",
        href: "/members",
      },
      {
        name: "Competitions",
        href: "/members/events",
      },
      {
        name: "Kit",
        href: "/members/kit",
      },
      {
        name: "Squadlist",
        href: "https://sudbury.squadlist.app",
        icon: CalendarIcon,
        cta: true,
      },
      {
        name: "myClubhouse",
        href: "https://sudburyrowingclub.myclubhouse.co.uk",
        icon: MyClubhouse,
        cta: true,
      },
      {
        name: "Spond",
        href: "https://spond.com/login",
        icon: Spond,
        cta: true,
      },
    ],
  },
];

const availableLogos: Record<
  (typeof SOCIALS)[keyof typeof SOCIALS]["name"],
  typeof Instagram
> = {
  instagram: Instagram,
  facebook: Facebook,
};

export const socials: IconNavItemType[] = Object.entries(SOCIALS).map(
  ([key, { href, name }]) => ({
    name,
    href,
    icon: availableLogos[key],
  }),
);

export const misc = [
  {
    name: "Get brand assets",
    href: "/about/brand",
  },
  {
    name: "Privacy policy",
    href: "/governance/privacy-policy",
  },
  {
    name: "Content Management System",
    href: "https://edit.sudburyrowingclub.org.uk/",
  },
];

export const [{ items: about }, , { items: regatta }] = navigationGroups;
export const [, { items: members }] = secondaryNavigationGroups;
export { navigationGroups, secondaryNavigationGroups };
