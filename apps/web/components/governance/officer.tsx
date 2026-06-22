"use client";

import { Popover, Transition } from "@headlessui/react";
import { Crest } from "@sudburyrc/blue";
import { cloudflareLoader } from "@sudburyrc/images";
import { HelpCircle, MessageCircle, XCircle } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { Description } from "./description";

export type OfficerType = {
  id: string;
  role: string;
  occupant?: string;
  description?: string;
  vacant: boolean;
  hasEmail: boolean;
  image?: string;
};

const OfficerPhotograph = ({ id, name }: { id: string; name: string }) => (
  <Image
    alt={name}
    className="object-cover"
    fill
    loader={cloudflareLoader}
    sizes="(max-width: 768px) 45vw, (max-width: 1024px) 148px, 222px"
    src={id}
  />
);

export const OfficerPhotographOrPlaceholder = ({
  officer,
}: {
  officer: OfficerType;
}) => {
  if (officer.vacant) {
    return (
      <div className="font-bold text-gray-400 uppercase tracking-widest">
        TBA
      </div>
    );
  }

  if (officer.image) {
    return (
      <OfficerPhotograph id={officer.image} name={officer.occupant || ""} />
    );
  }

  return <Crest className="w-12 text-gray-400" />;
};

export const OfficerNameOrPlaceholder = ({
  officer,
}: {
  officer: OfficerType;
}) => {
  if (officer.vacant) {
    return <span>&nbsp;</span>;
  }

  if (officer.hasEmail) {
    return (
      <NextLink
        className="group flex items-center gap-1.5"
        href={{
          pathname: "contact",
          query: { to: officer.id },
        }}
        title={`Contact ${officer.occupant}`}
      >
        {officer.occupant}
        <span className="sr-only">(Contact {officer.occupant})</span>
        <MessageCircle
          aria-hidden
          className="text-blue-500 transition group-hover:text-gray-600"
          size="1em"
          strokeWidth="0.15em"
        />
      </NextLink>
    );
  }

  return <span>{officer.occupant}</span>;
};

export const Officer = ({ officer }: { officer: OfficerType }) => (
  <div key={officer.id}>
    <div className="relative mb-2 flex h-36 w-full items-center justify-center overflow-hidden rounded-sm bg-linear-to-b from-gray-200 to-gray-100">
      <OfficerPhotographOrPlaceholder officer={officer} />
      {officer.description && (
        <Popover>
          <Popover.Button>
            <HelpCircle
              aria-hidden
              className="absolute right-2 bottom-2 fill-white text-blue-500 transition hover:text-gray-700"
              size="1.15em"
              strokeWidth="0.15em"
            />
            <span className="sr-only">Show description</span>
          </Popover.Button>
          <Transition
            enter="transition-opacity duration-150 ease-in-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition duration-75 ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel className="absolute top-0 left-0 h-full w-full rounded-sm border border-gray-300 bg-opacity- bg-white p-2 backdrop-blur-sm">
              <div className="h-full w-full overflow-y-auto font-medium text-black text-sm">
                <p>{officer.description}</p>
              </div>
              <Popover.Button>
                <XCircle
                  className="absolute right-2 bottom-2 text-gray-500 transition hover:text-gray-700"
                  size="1em"
                  strokeWidth="0.15em"
                />
              </Popover.Button>
            </Popover.Panel>
          </Transition>
        </Popover>
      )}
    </div>
    <div className="font-semibold text-gray-800 tracking-snug">
      <OfficerNameOrPlaceholder officer={officer} />
    </div>
    <Description>{officer.role}</Description>
  </div>
);
