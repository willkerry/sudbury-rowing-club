import Governance from "@/components/icons/governance";
import History from "@/components/icons/history";
import MyClubhouse from "@/components/icons/myclubhouse";
import Results from "@/components/icons/results";
import Rower from "@/components/icons/rower";
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
} from "@heroicons/react/outline";
import Spond from "../icons/spond";

export const about = [
  {
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
    shortName: "Intro",
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
  {
    name: "Membership Rates",
    href: "/members/rates",
  },
  {
    name: "Race Fees",
    href: "/members/fees",
  },
  {
    name: "Committee Minutes",
    href: "/governance/minutes",
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
    href: "https://sudburyrowingclub.myclubhouse.co.uk",
    icon: Spond,
  },
];
