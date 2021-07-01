import { Fragment } from "react";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import {
  BookmarkAltIcon,
  CalendarIcon,
  InformationCircleIcon,
  MenuIcon,
  LocationMarkerIcon,
  MailIcon,
  ShieldCheckIcon,
  SupportIcon,
  XIcon,
} from "@heroicons/react/outline";

import Logo from "@/components/logo/";
import History from "@/components/icons/history";
import Safety from "@/components/icons/safety";
import Governance from "@/components/icons/governance";
import Resources from "@/components/icons/resources";
import Rower from "@/components/icons/rower";
import Button from "@/components/stour/button";

import { ChevronDownIcon } from "@heroicons/react/solid";

import SafetyStatus from "./safety-status";

const about = [
  {
    name: "Introduction",
    description: "Welcome to Sudbury.",
    href: "#",
    icon: InformationCircleIcon,
  },
  {
    name: "Squads",
    description: "",
    href: "squads",
    icon: Rower,
  },
  {
    name: "History",
    description: "Rowing since 1874.",
    href: "history",
    icon: History,
  },
  {
    name: "Safety",
    description: "Rowing safely.",
    href: "safety",
    icon: Safety,
  },
  {
    name: "Governance",
    description: "How our club is organised.",
    href: "/governance",
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
    name: "Introduction",
    description:
      "Get all of your questions answered in our forums or contact support.",
    href: "#",
    icon: SupportIcon,
  },
  {
    name: "Results",
    description:
      "Learn how to maximize our platform to get the most out of it.",
    href: "#",
    icon: BookmarkAltIcon,
  },
  {
    name: "Find the regatta",
    description:
      "See what meet-ups and other events we might be planning near you.",
    href: "#",
    icon: CalendarIcon,
  },
  {
    name: "Security",
    description: "Understand how we take your privacy seriously.",
    href: "#",
    icon: ShieldCheckIcon,
  },
];
const recentPosts = [
  { id: 1, name: "Boost your conversion rate", href: "#" },
  {
    id: 2,
    name: "How to use search engine optimization to drive traffic to your site",
    href: "#",
  },
  { id: 3, name: "Improve your customer experience", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <Popover className="relative text-gray-100 bg-sudbury-brand">
      {({ open }) => (
        <>
          <div className="px-4 mx-auto max-w-7xl sm:px-6">
            <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/">
                  <>
                    <span className="sr-only">Sudbury Rowing Club</span>
                    <Logo className="w-auto h-8 sm:h-10" />
                  </>
                </Link>
              </div>
              <div className="-my-2 -mr-2 md:hidden">
                <Popover.Button className="inline-flex items-center justify-center p-2 transition rounded-md text-gray-40 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open menu</span>
                  <MenuIcon className="w-6 h-6" aria-hidden="true" />
                </Popover.Button>
              </div>
              <Popover.Group as="nav" className="hidden space-x-10 md:flex">
                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={classNames(
                          open ? "text-white" : "text-gray-300",
                          "group rounded-md inline-flex items-center text-base font-medium hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-sudbury-brand focus:ring-gray-300 "
                        )}
                      >
                        <span>About</span>
                        <ChevronDownIcon
                          className={classNames(
                            open ? "text-gray-300" : "text-gray-200",
                            "ml-2 h-5 w-5 group-hover:text-gray-300"
                          )}
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel
                          static
                          className="absolute z-20 w-screen max-w-sm px-2 mt-3 -ml-4 transform sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                        >
                          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="relative grid gap-6 px-5 py-6 bg-white sm:gap-8 sm:p-8">
                              {about.map((item) => (
                                <Link key={item.name} href={item.href}>
                                  <a className="flex items-start p-3 -m-3 rounded-lg hover:bg-gray-50">
                                    <item.icon
                                      className="flex-shrink-0 w-6 h-6 text-sudbury"
                                      aria-hidden="true"
                                    />
                                    <div className="ml-4">
                                      <p className="text-base font-medium text-gray-900">
                                        {item.name}
                                      </p>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {item.description}
                                      </p>
                                    </div>
                                  </a>
                                </Link>
                              ))}
                            </div>
                            <div className="px-5 py-5 space-y-6 bg-gray-50 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
                              {callsToAction.map((item) => (
                                <div key={item.name} className="flow-root">
                                  <Link href={item.href}>
                                    <a className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">
                                      <item.icon
                                        className="flex-shrink-0 w-6 h-6 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <span className="ml-3">{item.name}</span>
                                    </a>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>

                <Link href="#">
                  <a className="text-base font-medium text-gray-300 hover:text-white">
                    News
                  </a>
                </Link>

                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={classNames(
                          open ? "text-white" : "text-gray-300",
                          "group rounded-md inline-flex items-center text-base font-medium hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-sudbury-brand focus:ring-gray-300 "
                        )}
                      >
                        <span>Regatta</span>
                        <ChevronDownIcon
                          className={classNames(
                            open ? "text-gray-300" : "text-gray-200",
                            "ml-2 h-5 w-5 group-hover:text-gray-300"
                          )}
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel
                          static
                          className="absolute z-20 w-screen max-w-sm px-2 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0"
                        >
                          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="relative grid gap-6 px-5 py-6 bg-white sm:gap-8 sm:p-8">
                              {regatta.map((item) => (
                                <Link key={item.name} href={item.href}>
                                  <a className="flex items-start p-3 -m-3 rounded-lg hover:bg-gray-50">
                                    <item.icon
                                      className="flex-shrink-0 w-6 h-6 text-sudbury"
                                      aria-hidden="true"
                                    />
                                    <div className="ml-4">
                                      <p className="text-base font-medium text-gray-900">
                                        {item.name}
                                      </p>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {item.description}
                                      </p>
                                    </div>
                                  </a>
                                </Link>
                              ))}
                            </div>
                            <div className="px-5 py-5 bg-gray-50 sm:px-8 sm:py-8">
                              <div>
                                <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                                  Recent Posts
                                </h3>
                                <ul className="mt-4 space-y-4">
                                  {recentPosts.map((post) => (
                                    <li
                                      key={post.id}
                                      className="text-base truncate"
                                    >
                                      <Link href={post.href}>
                                        <a className="font-medium text-gray-900 hover:text-gray-700">
                                          {post.name}
                                        </a>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="mt-5 text-sm">
                                <Link href="#">
                                  <a className="font-medium text-sudbury-light hover:text-sudbury">
                                    View all posts
                                    <span aria-hidden="true">&rarr;</span>
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
              </Popover.Group>
              <div className="items-center justify-end hidden md:flex md:flex-1 lg:w-0">
                <SafetyStatus />
                <Link href="#">
                  <a className="ml-4 text-base font-medium text-gray-300 whitespace-nowrap hover:text-white">
                    Members
                  </a>
                </Link>
                <Link href="#">
                  <a className="inline-flex items-center justify-center px-2 py-1 ml-4 text-base font-medium text-white transition border-2 border-white rounded-md shadow-sm whitespace-nowrap hover:bg-white hover:text-sudbury-brand">
                    Join us
                  </a>
                </Link>
              </div>
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
                      <Logo className="w-auto h-9 text-sudbury-brand" />
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
                              className="flex-shrink-0 w-6 h-6 text-sudbury"
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
                      <a className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sudbury hover:bg-sudbury-brand">
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
