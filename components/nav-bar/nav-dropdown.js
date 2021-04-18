import { Menu } from "@headlessui/react";
import {
  BookOpenIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  LocationMarkerIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";

export default function NavDropdown() {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="inline-flex items-center text-base font-medium text-gray-300 rounded-md bg-sudbury-brand group hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <span>About</span>
          <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-400 group-hover:text-gray-500" />
        </Menu.Button>
        <Menu.Items>
          <div className="absolute z-10 w-screen max-w-md px-2 mt-3 -ml-4 transform sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="relative grid gap-6 px-5 py-6 bg-white sm:gap-8 sm:p-8">
                <Menu.Item className="flex items-start p-3 -m-3 rounded-lg hover:bg-gray-50">
                  {({ active }) => (
                    <a
                      className={`${active && "bg-blue-500"}`}
                      href="/account-settings"
                    >
                      <InformationCircleIcon className="flex-shrink-0 w-6 h-6 text-sudbury" />
                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900">
                          About
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          An introduction to Sudbury Rowing Club.
                        </p>
                      </div>
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item className="flex items-start p-3 -m-3 rounded-lg hover:bg-gray-50">
                  {({ active }) => (
                    <a
                      className={`${active && "bg-blue-500"}`}
                      href="/account-settings"
                    >
                      <svg
                        width={24}
                        height={24}
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0 w-6 h-6 text-sudbury"
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          strokeLinecap="round"
                          strokeLineJoin="round"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM17 21h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM5 21h2a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2zM6 15v-1c0-.667.167-1.167.5-1.5.333-.333.833-.5 1.5-.5h8c.296 0 1 0 1.5.5.333.333.5.833.5 1.5M12 9v3" />
                        </g>
                      </svg>
                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900">
                          Governance
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          How our club is organised.
                        </p>
                      </div>
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item className="flex items-start p-3 -m-3 rounded-lg hover:bg-gray-50">
                  {({ active }) => (
                    <a
                      className={`${active && "bg-blue-500"}`}
                      href="/account-settings"
                    >
                      <BookOpenIcon className="flex-shrink-0 w-6 h-6 text-sudbury" />
                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900">
                          History
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Rowing in Sudbury since 1874.
                        </p>
                      </div>
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item className="flex items-start p-3 -m-3 rounded-lg hover:bg-gray-50">
                  {({ active }) => (
                    <a
                      className={`${active && "bg-blue-500"}`}
                      href="/account-settings"
                    >
                      <svg
                        width={24}
                        height={24}
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0 w-6 h-6 text-sudbury"
                      >
                        <g
                          stroke="currentColor"
                          strokeWidth={2}
                          fill="none"
                          fillRule="evenodd"
                          strokeLinejoin="round"
                        >
                          <path d="M10.5 9.5c-.333-.333-.5-.833-.5-1.5V6c0-.667-.167-1.167-.5-1.5C9.167 4.167 8.667 4 8 4s-1.167.167-1.5.5c-.333.333-.5.833-.5 1.5v4c0 .667-.167 1.167-.5 1.5-.333.333-.833.5-1.5.5v7c0 .667.167 1.167.5 1.5.333.333.833.5 1.5.5h12c.667 0 1.167-.167 1.5-.5.333-.333.5-.833.5-1.5v-7c-.667 0-1.167-.167-1.5-.5-.333-.333-.5-.833-.5-1.5V6c0-.667-.167-1.167-.5-1.5-.333-.333-.833-.5-1.5-.5s-1.167.167-1.5.5c-.333.333-.5.833-.5 1.5v2c0 .667-.167 1.167-.5 1.5-.333.333-.833.5-1.5.5s-1.167-.167-1.5-.5zM12 10v11m-8-4h16M4 14h16" />
                          <path
                            d="M10 5.5c.444.333 1.111.5 2 .5s1.556-.167 2-.5"
                            strokeLinecap="round"
                          />
                        </g>
                      </svg>
                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900">
                          Safety
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Measures in place to maintain safety.
                        </p>
                      </div>
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item className="flex items-start p-3 -m-3 rounded-lg hover:bg-gray-50">
                  {({ active }) => (
                    <a
                      className={`${active && "bg-blue-500"}`}
                      href="/account-settings"
                    >
                      <DocumentTextIcon className="flex-shrink-0 w-6 h-6 text-sudbury" />

                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900">
                          Resources
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Build strategic funnels that will drive your customers
                          to convert
                        </p>
                      </div>
                    </a>
                  )}
                </Menu.Item>
              </div>
              <div className="px-5 py-5 space-y-6 bg-gray-50 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
                <div className="flow-root">
                  <Menu.Item>
                    <a
                      href="#"
                      className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100"
                    >
                      <LocationMarkerIcon className="flex-shrink-0 w-6 h-6 text-gray-400" />

                      <span className="ml-3">How to find us</span>
                    </a>
                  </Menu.Item>
                </div>
                <div className="flow-root">
                  <Menu.Item>
                    <a
                      href="#"
                      className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100"
                    >
                      {/* <!-- Heroicon name: outline/phone --> */}
                      <svg
                        className="flex-shrink-0 w-6 h-6 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="ml-3">Contact us</span>
                    </a>
                  </Menu.Item>
                </div>
              </div>
            </div>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
}
