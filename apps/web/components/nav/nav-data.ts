import {
  IconBrandFacebookFilled,
  IconBrandInstagramFilled,
  IconCake,
  IconCalendarFilled,
  IconFlag,
  IconInfoCircle,
  IconListNumbers,
  IconMail,
  IconMapPin,
  IconNews,
  IconPhoto,
  IconShieldCheck,
  IconSparkles,
  IconTicket,
} from "@tabler/icons-react";
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
        icon: IconNews,
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
        icon: IconSparkles,
        name: "Sponsorship",
      },
      {
        description: "View a century-and-a-half of photos.",
        href: "/150",
        icon: IconCake,
        name: "150th anniversary",
        shortName: "150 years",
      },
      {
        cta: true,
        href: "/contact/how-to-find-us",
        icon: IconMapPin,
        name: "How to find us",
        shortName: "Find us",
      },
      {
        cta: true,
        href: "/contact",
        icon: IconMail,
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
        icon: IconInfoCircle,
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
        icon: IconListNumbers,
        name: "Course records",
      },
      {
        href: "/regatta/entries",
        icon: IconTicket,
        name: "Entries",
      },
      {
        href: "/regatta/course",
        icon: IconFlag,
        name: "Course map",
        shortName: "Course",
      },
      {
        href: "/regatta/galleries",
        icon: IconPhoto,
        name: "Official photography",
        shortName: "Photography",
      },
      {
        href: "/regatta/competitor-information",
        icon: IconShieldCheck,
        name: "Competitor information",
        shortName: "Competitors",
      },
      {
        cta: true,
        href: "/contact/how-to-find-us",
        icon: IconMapPin,
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
        icon: IconCalendarFilled,
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
  typeof IconBrandInstagramFilled
> = {
  facebook: IconBrandFacebookFilled,
  instagram: IconBrandInstagramFilled,
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
