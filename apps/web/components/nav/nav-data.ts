import { CalendarIcon } from "@heroicons/react/20/solid";
import {
  CakeIcon,
  EnvelopeIcon,
  FlagIcon,
  InformationCircleIcon,
  MapPinIcon,
  NewspaperIcon,
  PhotoIcon,
  QueueListIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TicketIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Facebook, Instagram } from "lucide-react";
import {
  Governance,
  History,
  MyClubhouse,
  Results,
  Safety,
  Spond,
} from "@/components/icons";
import { SOCIALS } from "@/lib/constants";
import type { IconNavItemType } from "@/types/nav-item";

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
        description: "Rowing in Sudbury since 1874.",
        href: "/about/history",
        icon: History,
        name: "History",
      },
      {
        description: "Your safety is our top priority.",
        href: "/safety",
        icon: Safety,
        name: "Safety",
      },
      {
        description: "How our club is organised.",
        href: "/governance",
        icon: Governance,
        name: "Governance",
      },
      {
        description: "Discover the benefits of sponsorship.",
        href: "/about/sponsorship",
        icon: SparklesIcon,
        name: "Sponsorship",
      },
      {
        description: "View a century-and-a-half of photos.",
        href: "/150",
        icon: CakeIcon,
        name: "150th anniversary",
        shortName: "150 years",
      },
      {
        cta: true,
        href: "/contact/how-to-find-us",
        icon: MapPinIcon,
        name: "How to find us",
        shortName: "Find us",
      },
      {
        cta: true,
        href: "/contact",
        icon: EnvelopeIcon,
        name: "Contact",
      },
    ],
  },
  {
    title: "News",
    items: [
      {
        href: "/news",
        icon: NewspaperIcon,
        name: "News",
      },
    ],
  },
  {
    title: "Regatta",
    items: [
      {
        description:
          "Learn everything you need to know about Sudbury’s ’Little Henley‘.",
        href: "/regatta",
        icon: InformationCircleIcon,
        name: "The ‘International’",
        shortName: "About",
      },
      {
        href: "/regatta/results",
        icon: Results,
        name: "Results",
      },
      {
        href: "/regatta/records",
        icon: QueueListIcon,
        name: "Course records",
      },
      {
        href: "/regatta/entries",
        icon: TicketIcon,
        name: "Entries",
      },
      {
        href: "/regatta/course",
        icon: FlagIcon,
        name: "Course map",
        shortName: "Course",
      },
      {
        href: "/regatta/galleries",
        icon: PhotoIcon,
        name: "Official photography",
        shortName: "Photography",
      },
      {
        href: "/regatta/competitor-information",
        icon: ShieldCheckIcon,
        name: "Competitor information",
        shortName: "Competitors",
      },
      {
        cta: true,
        href: "/contact/how-to-find-us",
        icon: MapPinIcon,
        name: "Find the regatta",
        shortName: "Find",
      },
    ],
  },
];

const secondaryNavigationGroups: NavigationGroup[] = [
  {
    title: "Join",
    items: [
      {
        href: "/join",
        icon: UserPlusIcon,
        name: "Join",
      },
    ],
  },
  {
    title: "Members",
    items: [
      {
        href: "/members",
        name: "Notices",
      },
      {
        href: "/members/events",
        name: "Competitions",
      },
      {
        href: "/members/kit",
        name: "Kit",
      },
      {
        href: "/members/membership-rates",
        name: "Rates",
      },
      {
        cta: true,
        href: "https://sudbury.squadlist.app",
        icon: CalendarIcon,
        name: "Squadlist",
      },
      {
        cta: true,
        href: "https://sudburyrowingclub.myclubhouse.co.uk",
        icon: MyClubhouse,
        name: "myClubhouse",
      },
      {
        cta: true,
        href: "https://spond.com/login",
        icon: Spond,
        name: "Spond",
      },
    ],
  },
];

const availableLogos: Record<
  (typeof SOCIALS)[keyof typeof SOCIALS]["name"],
  typeof Instagram
> = {
  facebook: Facebook,
  instagram: Instagram,
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
    href: "/about/brand",
    name: "Get brand assets",
  },
  {
    href: "/governance/privacy-policy",
    name: "Privacy policy",
  },
  {
    href: "https://edit.sudburyrowingclub.org.uk/",
    name: "Content Management System",
  },
  {
    href: "/stourtoys",
    name: "StourToys",
  },
];

export const [{ items: about }, , { items: regatta }] = navigationGroups;
export const [, { items: members }] = secondaryNavigationGroups;
export { navigationGroups, secondaryNavigationGroups };
