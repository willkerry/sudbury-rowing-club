"use client";

import { Popover } from "@base-ui/react/popover";
import type { Governance } from "@sudburyrc/api";
import { Crest } from "@sudburyrc/blue";
import {
  IconCircleX,
  IconHelpCircle,
  IconMessageCircle,
} from "@tabler/icons-react";
import Image from "next/image";
import NextLink from "next/link";
import { useRef } from "react";
import { Link } from "@/components/stour/link";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import { Description } from "./description";
import { GovGrid } from "./gov-grid";
import { SectionTitle } from "./section-title";

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
      alt={name || ""}
      blurDataURL={lqip}
      className="object-cover"
      fill
      placeholder="blur"
      sizes="(max-width: 768px) 45vw, (max-width: 1024px) 148px, 222px"
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
    return <span>&nbsp;</span>;
  }

  if (hasEmail) {
    return (
      <NextLink
        className="group flex items-center gap-1.5"
        href={{
          pathname: "contact",
          query: { to: _id },
        }}
        title={`Contact ${name}`}
      >
        {name}
        <span className="sr-only">(Contact {name})</span>
        <IconMessageCircle
          aria-hidden
          className="text-blue-500 transition group-hover:text-gray-600"
          size="1em"
          stroke="0.15em"
        />
      </NextLink>
    );
  }

  return <span>{name}</span>;
};

const OfficerDescription = ({
  anchor,
  description,
}: {
  anchor: React.RefObject<HTMLDivElement | null>;
  description: string;
}) => (
  <Popover.Root>
    <Popover.Trigger className="absolute right-2 bottom-2 text-blue-500 transition-colors hover:text-gray-700">
      <IconHelpCircle
        aria-hidden
        className="fill-white"
        size="1.15em"
        stroke="0.15em"
      />
      <span className="sr-only">Show description</span>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner
        align="start"
        anchor={anchor}
        className="z-10"
        collisionAvoidance={{ align: "none", side: "none" }}
        side="bottom"
        sideOffset={({ anchor: { height } }) => -height}
      >
        <Popover.Popup className="relative h-(--anchor-height) w-(--anchor-width) rounded-sm border border-gray-300 bg-white p-2 transition-opacity duration-150 ease-out-strong data-ending-style:opacity-0 data-starting-style:opacity-0">
          <div className="h-full w-full overflow-y-auto font-medium text-black text-sm">
            <p>{description}</p>
          </div>
          <Popover.Close className="absolute right-2 bottom-2 text-gray-500 transition-colors hover:text-gray-700">
            <IconCircleX aria-hidden size="1em" stroke="0.15em" />
            <span className="sr-only">Hide description</span>
          </Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);

const OfficerCard = ({ officer }: { officer: Governance["officers"][0] }) => {
  const photographRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div
        className="relative mb-2 flex h-36 w-full items-center justify-center overflow-hidden rounded-sm bg-linear-to-b from-gray-200 to-gray-100"
        ref={photographRef}
      >
        <OfficerPhotographOrPlaceholder {...{ officer }} />
        {officer.description && (
          <OfficerDescription
            anchor={photographRef}
            description={officer.description}
          />
        )}
      </div>
      <div className="font-semibold text-gray-800 tracking-snug">
        <OfficerNameOrPlaceholder {...{ officer }} />
      </div>
      <Description>{officer.role}</Description>
    </div>
  );
};

export const Officers = ({ officers }: Props) => (
  <section>
    <SectionTitle>Club Officers</SectionTitle>
    <GovGrid>
      {officers.map((officer) => (
        <OfficerCard key={officer._id} officer={officer} />
      ))}
    </GovGrid>

    <p className="py-12 text-gray-500 text-sm">
      The role descriptions provided above are abbreviated and for illustrative
      purposes only. Please refer to the{" "}
      <Link href="/governance/constitution">constitution</Link> for accurate
      details. If you wish to enquire about a vacant position, please{" "}
      <Link href="/contact?q=secretary">contact the club secretary</Link>.
    </p>
  </section>
);
