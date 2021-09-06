import Governance from "@/components/icons/governance";
import History from "@/components/icons/history";
import MyClubhouse from "@/components/icons/myclubhouse";
import Results from "@/components/icons/results";
import Safety from "@/components/icons/safety";
import {
  CalendarIcon,
  InformationCircleIcon,
  LocationMarkerIcon,
  MailIcon,
  NewspaperIcon,
  PhotographIcon,
  ShieldCheckIcon,
  TicketIcon,
  FlagIcon,
} from "@heroicons/react/outline";
import { Facebook, Instagram, Twitter } from "react-feather";
import Rower from "../icons/rower";
import Spond from "../icons/spond";

export const about = [
  /* {
    name: "Squads",
    description: "",
    href: "squads",
    icon: Rower,
    quicklinks: [
      { name: "Junior squad", href: "" },
      { name: "Womens’ squad", href: "" },
      { name: "Men’s squad", href: "" },
      { name: "Adaptive rowing", href: "" },
      { name: "Indoor rowing", href: "" },
      { name: "Recreation", href: "" },
    ],
  }, */
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
    name: "News",
    href: "/news",
    mobileOnly: true,
    icon: NewspaperIcon,
  },
];
export const aboutCTAs = [
  {
    name: "How to find us",
    href: "/contact/how-to-find-us",
    icon: LocationMarkerIcon,
  },
  { name: "Contact us", href: "/contact", icon: MailIcon },
];
export const regatta = [
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
    name: "Events",
    href: "/regatta/course",
    icon: Rower,
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
    icon: PhotographIcon,
  },
  {
    name: "Competitor information",
    shortName: "Competitors",
    href: "/regatta/competitor-information",
    icon: ShieldCheckIcon,
  },
];
export const regattaCTAs = [
  {
    name: "Find the regatta",
    href: "/contact/how-to-find-us",
    icon: LocationMarkerIcon,
  },
  {
    name: "Entries",
    href: "/regatta/entries",
    icon: TicketIcon,
  },
];
export const members = [
  {
    name: "Officer Nominations",
    href: "/members/officer-nominations",
  },
];
export const memberCTAs = [
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
export const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/sudburyrowingclubuk",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://m.facebook.com/sudburyrowing",
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
];
