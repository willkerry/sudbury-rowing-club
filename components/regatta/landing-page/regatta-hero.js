import { ChevronRight } from "react-feather";
import { ImageComposite } from "@/components/regatta/landing-page/image-composite";
import Link from "@/components/stour/link";

export default function RegattaHero({ ticketItems, subtitle }) {
  return (
    <div className="max-w-lg mx-auto my-12 text-center">
      <ImageComposite ticketItems={ticketItems} />
      <h1 className="pb-12 text-5xl font-extrabold tracking-tighter text-transparent sm:text-7xl md:text-7xl bg-clip-text bg-gradient-to-br from-blue-400 to-blue-900">
        Sudbury{" "}
        <span className="font-light text-gray-900">‘International’</span>{" "}
        Regatta
      </h1>
      <p className="text-xl text-gray-800">
        {subtitle}{" "}
        <Link href="/">
          Learn more
          <ChevronRight className="inline-flex mb-px" size="1em" />
        </Link>
      </p>
    </div>
  );
}
