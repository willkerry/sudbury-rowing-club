import { Fragment } from "react";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import {
  InformationCircleIcon,
  MenuIcon,
  LocationMarkerIcon,
  MailIcon,
  ShieldCheckIcon,
  XIcon,
  TicketIcon,
  PhotographIcon,
  ChartBarIcon,
} from "@heroicons/react/outline";
import { Calendar, Users } from "react-feather";

import Logo from "@/components/logo/";
import History from "@/components/icons/history";
import Safety from "@/components/icons/safety";
import Governance from "@/components/icons/governance";
import Resources from "@/components/icons/resources";
import Rower from "@/components/icons/rower";
import Results from "@/components/icons/results";

import SafetyStatus from "./safety-status";
import MyClubhouse from "../icons/myclubhouse";
import { Button as StourButton } from "../stour/button";
import NavPopover from "./nav-popover";
import { NavLink } from "./nav-popover";

const about = [
  {
    name: "Squads",
    description: "",
    href: "squads",
    icon: Rower,
    quicklinks: [
      { name: "Juniors", href: "" },
      { name: "Women", href: "" },
      { name: "Men", href: "" },
      { name: "Adaptive", href: "" },
      { name: "Indoor", href: "" },
      { name: "Recreational", href: "" },
    ],
  },
  {
    name: "History",
    description: "Rowing since 1874.",
    href: "../history",
    icon: History,
  },
  {
    name: "Safety",
    description: "Rowing safely.",
    href: "../safety",
    icon: Safety,
  },
  {
    name: "Governance",
    description: "How our club is organised.",
    href: "../governance",
    icon: Governance,
  },
  {
    name: "Resources",
    description: "Useful links",
    href: "resources",
    icon: Resources,
  },
];
const callsToAction = [
  {
    name: "How to find us",
    href: "/contact/how-to-find-us",
    icon: LocationMarkerIcon,
  },
  { name: "Contact us", href: "/contact", icon: MailIcon },
];
const regatta = [
  {
    name: "The ’International’",
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
    href: "/regatta/galleries",
    icon: PhotographIcon,
  },
  {
    name: "Competitor information",
    href: "/regatta/competitor-information",
    icon: ShieldCheckIcon,
  },
];
const regattaCTAs = [
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
const members = [
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
    name: "Club Kit",
    href: "/members/kit",
  },
  {
    name: "Committee Minutes",
    href: "/governance/minutes",
  },
  {
    name: "Training Resources",
    href: "/members/training",
  },
  {
    name: "Fundraising",
    href: "/members/fundraising",
  },
];
const memberCTAs = [
  {
    name: "Squadlist",
    href: "https://sudbury.squadlist.app",
    icon: Calendar,
  },
  {
    name: "myClubhouse",
    href: "https://sudburyrowingclub.myclubhouse.co.uk",
    icon: MyClubhouse,
  },
];
export default function Navbar() {
  return (
    <Popover className="relative text-gray-900 bg-white">
      {({ open }) => (
        <>
          <div className="max-w-screen-lg px-4 mx-auto sm:px-6">
            <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="../../">
                  <a>
                    <span className="sr-only">Sudbury Rowing Club</span>
                    <Logo className="w-auto h-8 sm:h-10" />
                  </a>
                </Link>
              </div>
              <div className="-my-2 -mr-2 md:hidden">
                <Popover.Button className="inline-flex items-center justify-center p-2 transition rounded-md text-gray-40 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open menu</span>
                  <MenuIcon className="w-6 h-6" aria-hidden="true" />
                </Popover.Button>
              </div>
              <Popover.Group as="nav" className="hidden space-x-6 md:flex">
                <NavPopover
                  label="About"
                  navData={about}
                  ctaData={callsToAction}
                />
                <NavLink href="/news">News</NavLink>
                <NavPopover
                  label="Regatta"
                  navData={regatta}
                  ctaData={regattaCTAs}
                />
              </Popover.Group>
              <Popover.Group className="items-center justify-end hidden space-x-4 md:flex md:flex-1 lg:w-0">
                <SafetyStatus />
                <NavPopover
                  compact
                  icon={Users}
                  label="Members"
                  navData={members}
                  ctaData={memberCTAs}
                />
                <StourButton label="Join us" size="small" />
              </Popover.Group>
            </div>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              static
              className="absolute inset-x-0 top-0 p-2 transition origin-top-right transform md:hidden"
            >
              <div className="bg-white divide-y-2 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-gray-50">
                <div className="px-5 pt-5 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Logo className="w-auto text-blue-800 h-9" />
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sudbury">
                        <span className="sr-only">Close menu</span>
                        <XIcon className="w-6 h-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <nav className="grid gap-y-8">
                      {about.map((item) => (
                        <Link key={item.name} href={item.href}>
                          <a className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50">
                            <item.icon
                              className="flex-shrink-0 w-6 h-6 text-blue-700"
                              aria-hidden="true"
                            />
                            <span className="ml-3 text-base font-medium text-gray-900">
                              {item.name}
                            </span>
                          </a>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="px-5 py-6 space-y-6">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    <Link href="#">
                      <a className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Pricing
                      </a>
                    </Link>
                    <Link href="#">
                      <a className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Docs
                      </a>
                    </Link>
                    {regatta.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <a className="text-base font-medium text-gray-900 hover:text-gray-700">
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                  <div>
                    <Link href="#">
                      <a className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sudbury hover:bg-blue-800">
                        Join us
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
