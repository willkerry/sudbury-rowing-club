import {
  Governance,
  History,
  MyClubhouse,
  Results,
  Rower,
  Safety,
  Spond
} from "@/components/icons";
import { type NavItemType, type IconNavItemType } from "@/types/nav-item";
import {
  CalendarIcon,
  FlagIcon,
  InformationCircleIcon,
  LocationMarkerIcon,
  MailIcon,
  NewspaperIcon,
  PhotographIcon,
  ShieldCheckIcon,
  TicketIcon,
  UserAddIcon
} from "@heroicons/react/outline";
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
    icon: UserAddIcon,
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
    icon: LocationMarkerIcon,
  },
  {
    name: "Contact us",
    shortName: "Contact",
    href: "/contact",
    icon: MailIcon,
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
  // {
  //   name: "Events",
  //   href: "/regatta/events",
  //   icon: Rower,
  // },
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
    icon: PhotographIcon,
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
    href: "/contact/how-to-find-us",
    icon: LocationMarkerIcon,
  }
];
export const members: NavItemType[] = [
  {
    name: "Notices",
    href: "/members",
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
  },
  {
    name: "myClubhouse",
    href: "https://sudburyrowingclub.myclubhouse.co.uk",
    icon: MyClubhouse,
  },
  {
    name: "Spond",
    href: "https://spond.com/login",
    icon: Spond,
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
