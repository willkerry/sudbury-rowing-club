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
  UserGroupIcon,
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
import type { NavigationGroup, NavigationItem } from "./types";

const navigationGroups: NavigationGroup[] = [
  {
    title: "About",
    items: [
      {
        name: "Squads",
        description: "Find out about our squads.",
        href: "/about/squads",
        icon: UserGroupIcon,
        items: [
          {
            name: "Masters",
            href: "/about/squads/masters",
          },
          {
            name: "Seniors",
            href: "/about/squads/seniors",
          },
          {
            name: "Adaptive",
            href: "/about/squads/adaptive",
          },
          {
            name: "Juniors",
            href: "/about/squads/juniors",
          },
        ],
      },
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
        name: "Sponsorship",
        description: "Discover the benefits of sponsorship.",
        href: "/about/sponsorship",
        icon: SparklesIcon,
      },
      {
        name: "150th anniversary",
        shortName: "150 years",
        description: "View a century-and-a-half of photos.",
        href: "/150",
        icon: CakeIcon,
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
        name: "Course records",
        href: "/regatta/records",
        icon: QueueListIcon,
      },
      {
        name: "Entries",
        href: "/regatta/entries",
        icon: TicketIcon,
      },
      {
        name: "Course map",
        shortName: "Course",
        href: "/regatta/course",
        icon: FlagIcon,
      },
      {
        name: "Official photography",
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
        name: "Rates",
        href: "/members/membership-rates",
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

export const socials: NavigationItem[] = Object.entries(SOCIALS).map(
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
