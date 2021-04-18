import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import {
  BookOpenIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  LocationMarkerIcon,
  MailIcon,
} from "@heroicons/react/outline";
import { ChevronRightIcon } from "@heroicons/react/solid";
import styles from "../../components/nav-bar/nav.module.css";
import cn from "classnames";

import History from "@/components/icons/history";
import Safety from "@/components/icons/safety";
import Governance from "@/components/icons/governance";
import Resources from "@/components/icons/resources";
import Rower from "@/components/icons/rower";

export default function NavDropdown() {
  return (
    <div className="relative z-40">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className={styles.navButton}>
              <span>About</span>
              <ChevronRightIcon
                className={
                  styles.chevron +
                  `${open ? " transform rotate-90 transition" : ""}`
                }
              />
            </Menu.Button>
            <Transition
              show={open}
              enter="transition duration-200 ease-in-out"
              enterFrom="transform scale-0 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items>
                <div className={styles.menuItemsParent}>
                  <div className={styles.menuItemsMiddle}>
                    <div className={styles.menuItemsChild}>
                      <Link href="/">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/"
                              className={cn(styles.menuItem, {
                                "bg-gray-50": active,
                              })}
                            >
                              <InformationCircleIcon
                                className={styles.menuItemIcon}
                              />
                              <div className="ml-4">
                                <p className={styles.menuItemTitle}>
                                  Introduction
                                </p>
                                <p className={styles.menuItemDescription}>
                                  Welcome to Sudbury
                                </p>
                              </div>
                            </a>
                          )}
                        </Menu.Item>
                      </Link>
                      <div href="/" className={styles.menuItem}>
                        <Rower className={styles.menuItemIcon} />
                        <div className="ml-4">
                          <p className="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                            Squads
                          </p>
                          <div className="grid grid-cols-2">
                            <Link href="/">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cn(styles.menuItemLink, {
                                      "text-gray-800": active,
                                    })}
                                  >
                                    Ladies
                                  </a>
                                )}
                              </Menu.Item>
                            </Link>
                            <Link href="/">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cn(styles.menuItemLink, {
                                      "text-gray-800": active,
                                    })}
                                  >
                                    Men
                                  </a>
                                )}
                              </Menu.Item>
                            </Link>
                            <Link href="/">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cn(styles.menuItemLink, {
                                      "text-gray-800": active,
                                    })}
                                  >
                                    Juniors
                                  </a>
                                )}
                              </Menu.Item>
                            </Link>
                            <Link href="/">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cn(styles.menuItemLink, {
                                      "text-gray-800": active,
                                    })}
                                  >
                                    Recreational
                                  </a>
                                )}
                              </Menu.Item>
                            </Link>
                            <Link href="/">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cn(styles.menuItemLink, {
                                      "text-gray-800": active,
                                    })}
                                  >
                                    Adaptive
                                  </a>
                                )}
                              </Menu.Item>
                            </Link>
                            <Link href="/">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cn(styles.menuItemLink, {
                                      "text-gray-800": active,
                                    })}
                                  >
                                    Indoor
                                  </a>
                                )}
                              </Menu.Item>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={cn(styles.menuItem, {
                              "bg-gray-50": active,
                            })}
                            href="/history"
                          >
                            <History className={styles.menuItemIcon} />

                            <div className="ml-4">
                              <p className={styles.menuItemTitle}>History</p>
                              <p className={styles.menuItemDescription}>
                                Rowing since 1874
                              </p>
                            </div>
                          </a>
                        )}
                      </Menu.Item>
                      <Link href="/governance">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              className={cn(styles.menuItem, {
                                "bg-gray-50": active,
                              })}
                              href="/governance"
                            >
                              <Governance className={styles.menuItemIcon} />

                              <div className="ml-4">
                                <p className={styles.menuItemTitle}>
                                  Governance
                                </p>
                                <p className={styles.menuItemDescription}>
                                  How our club is organised.
                                </p>
                              </div>
                            </a>
                          )}
                        </Menu.Item>
                      </Link>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={cn(styles.menuItem, {
                              "bg-gray-50": active,
                            })}
                            href="/account-settings"
                          >
                            <Safety className={styles.menuItemIcon} />
                            <div className="ml-4">
                              <p className={styles.menuItemTitle}>Safety</p>
                              <p className={styles.menuItemDescription}>
                                Our precautions
                              </p>
                            </div>
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={cn(styles.menuItem, {
                              "bg-gray-50": active,
                            })}
                            href="/account-settings"
                          >
                            <Resources className={styles.menuItemIcon} />

                            <div className="ml-4">
                              <p className={styles.menuItemTitle}>Resources</p>
                              <p className={styles.menuItemDescription}>
                                Useful links
                              </p>
                            </div>
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                    <div className={styles.menuFooter}>
                      <div className="flow-root">
                        <Menu.Item>
                          <a href="#" className={styles.menuFooterItem}>
                            <LocationMarkerIcon
                              className={styles.menuFooterIcon}
                            />

                            <span className="ml-3">How to find us</span>
                          </a>
                        </Menu.Item>
                      </div>
                      <div className="flow-root">
                        <Menu.Item>
                          <a href="#" className={styles.menuFooterItem}>
                            <MailIcon className={styles.menuFooterIcon} />
                            <span className="ml-3">Contact us</span>
                          </a>
                        </Menu.Item>
                      </div>
                    </div>
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
