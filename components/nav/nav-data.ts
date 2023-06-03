import {
  Governance,
  History,
  MyClubhouse,
  Results,
  Safety,
  Spond,
} from "@/components/icons";
import { IconNavItemType, NavItemType } from "@/types/nav-item";
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
import { Facebook, Instagram, Twitter } from "react-feather";

export const about: IconNavItemType[] = [
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
    name: "Join",
    href: "/join",
    mobileOnly: true,
    icon: UserPlusIcon,
  },
  {
    name: "News",
    href: "/news",
    mobileOnly: true,
    icon: NewspaperIcon,
  },
];
export const aboutCTAs: IconNavItemType[] = [
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
];
export const regatta: IconNavItemType[] = [
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
];
export const regattaCTAs: IconNavItemType[] = [
  {
    name: "Find the regatta",
    shortName: "Find",
    href: "/contact/how-to-find-us",
    icon: MapPinIcon,
    cta: true,
  },
];
export const members: NavItemType[] = [
  {
    name: "Notices",
    href: "/members",
  },
  {
    name: "Competition Calendar",
    href: "/members/events",
  },
  {
    name: "Minutes",
    href: "/governance/minutes",
  },
  {
    name: "Kit",
    href: "/members/kit",
  },
];
export const memberCTAs: IconNavItemType[] = [
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
];
export const socials: IconNavItemType[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/sudburyrowingclubuk",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/sudburyrowing",
    icon: Facebook,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/sudbury_rowing",
    icon: Twitter,
  },
];
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
