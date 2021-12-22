import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";
import randomUUID from "crypto";
import cn from "classnames";
import Label from "@/components/stour/label";

function Detail({ summary, icon, children }) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center justify-between w-full px-4 overflow-hidden transition border-t first:border-t-0 h-14 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 group">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 text-gray-400">{icon}</div>
              <Label className="transition group-hover:text-black">
                {summary}
              </Label>
            </div>
            <div className="justify-self-end">
              <ChevronDownIcon
                className={cn(
                  "w-6 h-6 text-gray-400 transition duration-300 opacity-0 group-hover:opacity-100",
                  open ? "transform -rotate-180" : ""
                )}
              />
            </div>
          </Disclosure.Button>
          <div className="overflow-hidden">
            <Transition
              enter="transition delay-50 duration-300 ease-in-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition duration-300 delay-50 ease-in-out"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Disclosure.Panel className="p-4 border-t">
                {children}
              </Disclosure.Panel>
            </Transition>
          </div>
        </>
      )}
    </Disclosure>
  );
}

Detail.propTypes = {
  summary: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default function Details({ items }) {
  return (
    <div className="border rounded">
      {items.map((item) => (
        <Detail
          key={randomUUID.randomBytes(4)}
          summary={item.summary}
          icon={item.icon}
        >
          {item.content}
        </Detail>
      ))}
    </div>
  );
}

Details.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      summary: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired,
    })
  ),
};

Details.defaultProps = {
  items: [],
};
