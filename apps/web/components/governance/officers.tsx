import { Description, GovGrid, SectionTitle } from "@/components/governance";
import Link from "@/components/stour/link";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import { Popover, Transition } from "@headlessui/react";
import type { Governance } from "@sudburyrc/api";
import { HelpCircle, MessageCircle, XCircle } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import Crest from "../logo/crest";

type Props = {
  officers: Governance["officers"];
};

const OfficerPhotograph = ({
  id,
  lqip,
  name,
}: {
  id: string;
  lqip: string;
  name: string;
}) => {
  const { src, loader } = useSanityImageProps(id);

  return (
    <Image
      {...{ src, loader }}
      fill
      sizes="(max-width: 768px) 45vw, (max-width: 1024px) 148px, 222px"
      placeholder="blur"
      blurDataURL={lqip}
      className="object-cover"
      alt={name || ""}
    />
  );
};

const OfficerPhotographOrPlaceholder = ({
  officer: { image, vacant, name },
}: {
  officer: Governance["officers"][0];
}) => {
  if (vacant) {
    return (
      <div className="font-bold text-gray-400 uppercase tracking-widest">
        TBA
      </div>
    );
  }

  if (image) {
    return (
      <OfficerPhotograph id={image._id} lqip={image.lqip} name={name || ""} />
    );
  }

  return <Crest className="w-12 text-gray-400" />;
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
                    className="absolute right-2 bottom-2 fill-white text-blue-500 transition hover:text-gray-700"
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
                  <Popover.Panel className="absolute top-0 left-0 h-full w-full rounded border border-gray-300 bg-opacity- bg-white p-2 backdrop-blur">
                    <div className="font-medium text-black text-sm">
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
            <OfficerNameOrPlaceholder {...{ officer }} />
          </div>
          <Description>{officer.role}</Description>
        </div>
      ))}
    </GovGrid>

    <p className="py-12 text-gray-500 text-sm">
      The role descriptions provided above are abbreviated and for illustrative
      purposes only. Please refer to the{" "}
      <Link href="/governance/constitution">constitution</Link> for accurate
      details. If you wish to enquire about a vacant position, please contact
      the club secretary.
    </p>
  </section>
);

export default Officers;
