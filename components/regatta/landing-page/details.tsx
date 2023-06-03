import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import cn from "@/lib/cn";
import Label from "@/components/stour/label";

export type DetailProps = {
  summary: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const Detail = ({ summary, icon, children }: DetailProps) => (
  <Disclosure>
    {({ open }) => (
      <>
        <Disclosure.Button className="group flex h-14 w-full items-center justify-between overflow-hidden border-t px-4 transition first:border-t-0 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 text-gray-400">{icon}</div>
            <Label className="transition group-hover:text-black">
              {summary}
            </Label>
          </div>
          <div className="justify-self-end">
            <ChevronDownIcon
              className={cn(
                "h-6 w-6 text-gray-400 opacity-0 transition duration-300 group-hover:opacity-100",
                open ? "-rotate-180 transform" : ""
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
            <Disclosure.Panel className="border-t p-4">
              {children}
            </Disclosure.Panel>
          </Transition>
        </div>
      </>
    )}
  </Disclosure>
);

const Details = ({ items }: { items: DetailProps[] }) => (
  <div className="rounded border">
    {items.map((item) => (
      <Detail key={item.summary} summary={item.summary} icon={item.icon}>
        {item.children}
      </Detail>
    ))}
  </div>
);

export default Details;
