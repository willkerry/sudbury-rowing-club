import ImageComposite from "@/components/regatta/landing-page/image-composite";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link as ScrollLink } from "react-scroll";

type Props = {
  ticketItems: [string, string | JSX.Element][];
  subtitle: string;
};

const RegattaHero = ({ ticketItems, subtitle }: Props) => (
  <div className="max-w-lg mx-auto my-12 text-center">
    <ImageComposite ticketItems={ticketItems} />
    <h1 className="pb-12 text-5xl font-extrabold tracking-tighter text-transparent sm:text-7xl md:text-7xl bg-clip-text bg-gradient-to-br from-blue-400 to-blue-900">
      Sudbury <span className="font-light text-gray-900">‘International’</span>{" "}
      Regatta
    </h1>
    <p className="text-xl text-gray-800">
      {subtitle}{" "}
      <ScrollLink
        to="regatta-body"
        offset={-175}
        smooth
        className="text-blue-500 hover:cursor-pointer hover:text-gray-600"
      >
        Learn more
        <ChevronRightIcon className="inline-flex w-5 h-5 mb-px" />
      </ScrollLink>
    </p>
  </div>
);

export default RegattaHero;
