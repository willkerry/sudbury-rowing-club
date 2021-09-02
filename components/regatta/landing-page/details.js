import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDown, Zap } from "react-feather";

export default function Details({ items }) {
  function Detail(props) {
    return (
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left bg-white border rounded-lg hover:border-gray-400 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-4 text-gray-500">{props.icon}</div>
                <div className="text-base text-gray-800">{props.summary}</div>
                <ChevronDown
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-5 h-5 text-gray-400 ml-2`}
                />
              </div>
            </Disclosure.Button>
            <div className="overflow-hidden">
              <Transition
                enter="transition ease-in-out duration-300 transform-gpu origin-top"
                enterFrom="-translate-y-full opacity-0"
                enterTo="translate-y-0  opacity-100"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="-translate-y-full opacity-0"
              >
                <Disclosure.Panel className="py-6">
                  {props.children}
                </Disclosure.Panel>
              </Transition>
            </div>
          </>
        )}
      </Disclosure>
    );
  }

  return (
    <div className="p-6 space-y-3 border bg-gray-50 rounded-2xl">
      <h3 className="pb-1.5 flex items-center">
        <Zap className="inline w-4 h-4 mr-1 text-blue-500 transform rotate-180" />
        <div className="text-sm font-medium tracking-wider text-gray-500 uppercase">
          Quick information
        </div>
      </h3>
      {items.map((item, index) => (
        <Detail key={index} summary={item.summary} icon={item.icon}>
          {item.content}
        </Detail>
      ))}
    </div>
  );
}
