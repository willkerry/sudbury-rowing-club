import ImageComposite from "@/components/regatta/landing-page/image-composite";
import { ScrollLink } from "@/components/utils/scroll-link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type { JSX } from "react";

type Props = {
  ticketItems: [string, string | JSX.Element][];
  subtitle: string;
};

const RegattaHero = ({ ticketItems, subtitle }: Props) => (
  <div className="mx-auto mb-12 max-w-lg text-center sm:mt-12">
    <ImageComposite ticketItems={ticketItems} />
    <h1 className="bg-linear-to-br from-blue-400 to-blue-950 bg-clip-text pb-12 font-bold text-5xl text-transparent tracking-tight sm:text-7xl md:text-7xl">
      Sudbury <span className="font-light text-gray-900">‘International’</span>{" "}
      Regatta
    </h1>
    <p className="text-gray-800 text-xl">
      {subtitle}{" "}
      <ScrollLink
        to="regatta-body"
        offset={-175}
        smooth
        className="text-blue-500 hover:cursor-pointer hover:text-gray-600"
      >
        Learn more
        <ChevronRightIcon aria-hidden className="mb-px inline-flex h-5 w-5" />
      </ScrollLink>
    </p>
  </div>
);

export default RegattaHero;
