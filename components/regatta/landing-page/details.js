import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon, LightningBoltIcon } from "@heroicons/react/solid";

export default function Details({ items }) {
  function Detail(props) {
    return (
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center w-full px-4 py-2 overflow-hidden text-sm font-medium text-left bg-white border-t focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
              <div className="w-8 h-8 mr-4 text-gray-500">{props.icon}</div>
              <div className="text-base text-gray-800">{props.summary}</div>
              <ChevronDownIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 mt-0.5 text-gray-400 ml-2`}
              />
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
                <Disclosure.Panel className="p-6 border-t">
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
    <div className="border rounded bg-gray-50">
      <h3 className="flex items-center px-4 py-3">
        <LightningBoltIcon className="inline w-4 h-4 mr-1 text-blue-500 transform rotate-180" />
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
