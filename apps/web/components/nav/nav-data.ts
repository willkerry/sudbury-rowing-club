import {
  CakeIcon,
  CalendarIcon,
  FlagIcon,
  ImageIcon,
  InfoIcon,
  ListOrderedIcon,
  MailIcon,
  MapPinIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TicketIcon,
} from "lucide-react";
import {
  Facebook,
  Governance,
  History,
  Instagram,
  MyClubhouse,
  Results,
  Safety,
  Spond,
} from "@/components/icons";
import { SOCIALS } from "@/lib/constants";
import type { IconNavItemType } from "@/types/nav-item";

type NavigationGroup = {
  title: string;
  compact?: boolean;
  items: IconNavItemType[];
};

const navigationGroups: NavigationGroup[] = [
  {
    title: "About",
    items: [
      {
        description: "The latest club news.",
        href: "/news",
        icon: NewspaperIcon,
        name: "News",
      },
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
        icon: MailIcon,
        name: "Contact",
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
        icon: InfoIcon,
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
        icon: ListOrderedIcon,
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
        icon: ImageIcon,
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
  {
    compact: true,
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

export const join: IconNavItemType = {
  href: "/join",
  name: "Join",
};

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

export const [{ items: about }, { items: regatta }, { items: members }] =
  navigationGroups;
export { navigationGroups };
