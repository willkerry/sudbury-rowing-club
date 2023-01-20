import { Description, GovGrid, SectionTitle } from "@/components/governance";
import Link from "@/components/stour/link";
import { urlFor } from "@/lib/sanity";
import { Officer } from "@/types/governance";
import { Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import NextLink from "next/link";
import {
  HelpCircle,
  Image as ImageIcon,
  MessageCircle,
  XCircle,
} from "react-feather";

type Props = {
  officers: Officer[];
};

const Officers = ({ officers }: Props) => (
  <section id="officers">
    <SectionTitle>Club Officers</SectionTitle>
    <GovGrid>
      {officers.map((officer) => (
        <div key={officer._id}>
          <div className="relative flex items-center justify-center w-full mb-2 overflow-hidden rounded h-36 bg-gradient-to-b from-gray-200 to-gray-100">
            {officer.vacant ? (
              <div className="font-bold tracking-widest text-gray-400 uppercase">
                TBA
              </div>
            ) : officer.image ? (
              <Image
                src={officer.image.url}
                fill
                placeholder="blur"
                blurDataURL={officer.image.lqip}
                className="object-cover"
                alt={officer.name || ""}
              />
            ) : (
              <ImageIcon className="text-gray-400" />
            )}
            {officer.description && (
              <Popover>
                <Popover.Button>
                  <HelpCircle
                    className="absolute text-blue-500 transition right-2 bottom-2 hover:text-gray-700"
                    size="1em"
                    strokeWidth="0.15em"
                  />
                </Popover.Button>
                <Transition
                  enter="transition-opacity duration-150 ease-in-out"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition duration-75 ease-in-out"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Panel className="absolute top-0 left-0 w-full h-full p-4 bg-white bg-opacity-50 rounded backdrop-blur">
                    <div className="text-xs font-medium text-gray-600">
                      <p>{officer.description}</p>
                    </div>
                    <Popover.Button>
                      <XCircle
                        className="absolute text-gray-500 transition hover:text-gray-700 right-2 bottom-2"
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
            {officer.vacant ? (
              <>&nbsp;</>
            ) : officer.hasEmail ? (
              <NextLink
                href={{
                  pathname: "contact",
                  query: { to: officer._id },
                }}
                className="flex items-center gap-1.5 group"
                title={`Contact ${officer.name}`}
              >
                {officer.name}
                <MessageCircle
                  size="1em"
                  strokeWidth="0.15em"
                  className="text-blue-500 transition group-hover:text-gray-600"
                />
              </NextLink>
            ) : (
              officer.name
            )}
          </div>
          <Description>{officer.role}</Description>
        </div>
      ))}
    </GovGrid>
    <p className="py-12 text-sm text-gray-500">
      The role descriptions provided above are abbreviated and for illustrative
      purposes only. Please refer to the{" "}
      <Link href="/governance/constitution">constitution</Link> for accurate
      details. If you wish to enquire about a vacant position, please contact
      the club secretary.
    </p>
  </section>
);

export default Officers;
