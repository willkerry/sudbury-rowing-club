import { Fragment } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

export const navLinkClasses =
  "group transition duration-200 inline-flex p-3 text-sm hover:text-black focus:outline-none hover:bg-gray-100 focus:bg- rounded-md";
export const navLinkColor = "text-gray-500";
export const navLinkActiveColor = "text-black";
const iconLinkColor = "text-gray-500";
const iconLinkClasses = "transition hover:text-black focus:outline-none";

function Chevron() {
  return (
    <ChevronDownIcon
      className={cn(
        "w-3 h-3 ml-0.5 -mb-px transition group-hover:text-gray-800 text-gray-400"
      )}
      aria-hidden="true"
    />
  );
}

export default function NavPopover(
  { label, icon, altLabel, compact, navData, ctaData },
  props
) {
  const NavItemList = ({ items }) =>
    items.map((item) => (
      <Link key={item.href} href={item.href} passHref>
        <a className="flex items-start p-3 -m-3 rounded hover:bg-gray-100">
          {item.icon && (
            <item.icon
              className="flex-shrink-0 w-6 h-6 text-blue-700"
              aria-hidden="true"
            />
          )}
          <div className={item.icon && "ml-4"}>
            <p className="text-base font-medium text-gray-900">{item.name}</p>
            {item.description && (
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
            )}
          </div>
        </a>
      </Link>
    ));
  const CompactNavItemList = ({ items }) =>
    items.map((item) => (
      <Link key={item.href} href={item.href} passHref>
        <a className="flex items-start p-2 -m-2 text-sm font-medium text-gray-900 rounded hover:bg-gray-100">
          <div className="whitespace-nowrap">{item.name}</div>
        </a>
      </Link>
    ));
  const CTAList = ({ CTAs }) =>
    CTAs.map((cta) => (
      <div key={cta.href} className="flow-root">
        <Link href={cta.href} passHref>
          <a className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 rounded-md hover:bg-gray-200">
            <cta.icon
              className="flex-shrink-0 w-6 h-6 text-gray-400"
              aria-hidden="true"
            />
            <span className="ml-3">{cta.name}</span>
          </a>
        </Link>
      </div>
    ));
  const popoverButton = ({ open }) => (
    <Popover.Button
      className={cn(
        open && navLinkActiveColor,
        icon
          ? [iconLinkColor, iconLinkClasses]
          : [navLinkColor, navLinkClasses, "items-center"]
      )}
    >
      {icon ? (
        <>
          <props.icon strokeWidth="1.5" className="w-5 h-5 mt-1" />
          <span className="sr-only">{label}</span>
        </>
      ) : (
        <>
          {label}
          {altLabel && <span className="sr-only">{altLabel}</span>}
          <Chevron />
        </>
      )}
    </Popover.Button>
  );
  const CompactCTAList = ({ CTAs }) =>
    CTAs.map((cta) => (
      <div key={cta.href} className="flow-root">
        <Link href={cta.href}>
          <a className="flex items-center p-2 -m-2 text-sm font-medium text-gray-900 rounded hover:bg-gray-200">
            <cta.icon
              className="flex-shrink-0 w-6 h-6 p-1 text-gray-600 bg-white border rounded-lg shadow-sm"
              aria-hidden="true"
            />
            <span className="ml-1.5">{cta.name}</span>
          </a>
        </Link>
      </div>
    ));

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          {popoverButton(open)}
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
              className={cn(
                "absolute z-20 px-2 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0",
                !compact ? "w-screen max-w-sm" : " max-w-xs"
              )}
            >
              <div className="overflow-hidden rounded shadow-lg ring-1 ring-black ring-opacity-5">
                {compact ? (
                  <div className="relative grid gap-4 p-4 bg-white">
                    <CompactNavItemList items={navData} />
                  </div>
                ) : (
                  <div className="relative grid gap-6 px-5 py-6 bg-white sm:gap-8 sm:p-8">
                    <NavItemList items={navData} />
                  </div>
                )}
                {compact ? (
                  <div className="px-4 py-4 space-y-5 bg-gray-100">
                    <CompactCTAList CTAs={ctaData} />
                  </div>
                ) : (
                  <div className="px-5 py-5 space-y-6 bg-gray-50 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
                    <CTAList CTAs={ctaData} />
                  </div>
                )}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
NavPopover.propTypes = {
  label: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
  altLabel: PropTypes.string,
  compact: PropTypes.bool,
  navData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      description: PropTypes.string,
      icon: PropTypes.elementType,
    })
  ).isRequired,
  ctaData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    })
  ).isRequired,
};
NavPopover.defaultProps = {
  icon: null,
  altLabel: null,
  compact: false,
};
