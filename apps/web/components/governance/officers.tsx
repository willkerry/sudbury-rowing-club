import { Description, GovGrid, SectionTitle } from "@/components/governance";
import Link from "@/components/stour/link";
import { urlFor } from "@sudburyrc/api";
import type { Governance } from "@sudburyrc/api";
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
  officers: Governance["officers"];
};

const OfficerPhotographOrPlaceholder = ({
  officer: { image, vacant, name },
}: {
  officer: Governance["officers"][0];
}) => {
  if (vacant) {
    return (
      <div className="font-bold uppercase tracking-widest text-gray-400">
        TBA
      </div>
    );
  }

  if (image) {
    return (
      <Image
        src={urlFor(image._id)
          .crop("entropy")
          .fit("clip")
          .size(500, 500)
          .sharpen(30)
          .url()}
        fill
        placeholder="blur"
        blurDataURL={image.lqip}
        className="object-cover"
        alt={name || ""}
      />
    );
  }

  return <ImageIcon className="text-gray-400" />;
};

const OfficerNameOrPlaceholder = ({
  officer: { _id, name, vacant, hasEmail },
}: {
  officer: Governance["officers"][0];
}) => {
  if (vacant) {
    return <>&nbsp;</>;
  }

  if (hasEmail) {
    return (
      <NextLink
        href={{
          pathname: "contact",
          query: { to: _id },
        }}
        className="group flex items-center gap-1.5"
        title={`Contact ${name}`}
      >
        {name}
        <span className="sr-only">(Contact {name})</span>
        <MessageCircle
          size="1em"
          strokeWidth="0.15em"
          className="text-blue-500 transition group-hover:text-gray-600"
          aria-hidden
        />
      </NextLink>
    );
  }

  return <span>{name}</span>;
};

const Officers = ({ officers }: Props) => (
  <section id="officers">
    <SectionTitle>Club Officers</SectionTitle>
    <GovGrid>
      {officers.map((officer) => (
        <div key={officer._id}>
          <div className="relative mb-2 flex h-36 w-full items-center justify-center overflow-hidden rounded bg-gradient-to-b from-gray-200 to-gray-100">
            <OfficerPhotographOrPlaceholder {...{ officer }} />
            {officer.description && (
              <Popover>
                <Popover.Button>
                  <HelpCircle
                    className="absolute bottom-2 right-2  fill-white text-blue-500 transition hover:text-gray-700"
                    size="1.15em"
                    strokeWidth="0.15em"
                    aria-hidden
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
                  <Popover.Panel className="bg-opacity- absolute left-0 top-0 h-full w-full rounded border border-gray-300 bg-white p-2 backdrop-blur">
                    <div className="text-sm font-medium text-black">
                      <p>{officer.description}</p>
                    </div>
                    <Popover.Button>
                      <XCircle
                        className="absolute bottom-2 right-2 text-gray-500 transition hover:text-gray-700"
                        size="1em"
                        strokeWidth="0.15em"
                      />
                    </Popover.Button>
                  </Popover.Panel>
                </Transition>
              </Popover>
            )}
          </div>
          <div className="tracking-snug font-semibold text-gray-800">
            <OfficerNameOrPlaceholder {...{ officer }} />
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
