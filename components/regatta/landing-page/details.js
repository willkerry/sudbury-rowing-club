import Label from "@/components/stour/label";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import cn from "classnames";

export default function Details({ items }) {
  function Detail(props) {
    return (
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center justify-between w-full px-4 overflow-hidden transition border-t first:border-t-0 h-14 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 group">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 text-gray-400">
                  {props.icon}
                </div>
                <Label className="transition group-hover:text-black">
                  {props.summary}
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
    <div className="border rounded">
      {/* <h3 className="flex items-center h-10 px-4 bg-gray-100">
        <LightningBoltIcon className="inline w-4 h-4 ml-1 mr-4 text-gray-300 transform rotate-180" />
        <Label className="text-xs">Quick Information</Label>
      </h3> */}
      {items.map((item, index) => (
        <Detail key={index} summary={item.summary} icon={item.icon}>
          {item.content}
        </Detail>
      ))}
    </div>
  );
}
