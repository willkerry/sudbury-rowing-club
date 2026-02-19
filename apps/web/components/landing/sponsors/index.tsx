import type { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import abglass from "../../../public/assets/logos/ab-glass-home-improvement.svg";
import ashtons from "../../../public/assets/logos/ashtons.svg";
import britishRowing from "../../../public/assets/logos/british-rowing.svg";
import errc from "../../../public/assets/logos/errc.svg";
import mooreGreen from "../../../public/assets/logos/moore-green.svg";
import swan from "../../../public/assets/logos/swan-at-lavenham.svg";
import { LogoList } from "./LogoList";

export type SponsorLogo = {
  href: string;
  logo: StaticImageData;
  name: string;
  type: "sponsor" | "affiliate";
};

export const logos: SponsorLogo[] = [
  {
    href: "https://www.abglasshomeimprovements.co.uk/",
    logo: abglass,
    name: "A&B Glass Home Improvements",
    type: "sponsor",
  },
  {
    href: "https://www.mooregreen.co.uk/",
    logo: mooreGreen,
    name: "Moore Green",
    type: "sponsor",
  },
  {
    href: "https://www.ashtonslegal.co.uk/",
    logo: ashtons,
    name: "Ashtons",
    type: "sponsor",
  },
  {
    href: "https://theswanatlavenham.co.uk/?utm_source=website&utm_medium=listing&utm_campaign=sudbury_rowing_club",
    logo: swan,
    name: "The Swan at Lavenham",
    type: "sponsor",
  },
  {
    href: "https://britishrowing.org/",
    logo: britishRowing,
    name: "British Rowing",
    type: "affiliate",
  },
  {
    href: "http://easternregionrowing.org.uk/",
    logo: errc,
    name: "Eastern Region Rowing Council",
    type: "affiliate",
  },
];

const sponsorLogos = logos.filter(({ type }) => type === "sponsor");
const affiliateLogos = logos.filter(({ type }) => type === "affiliate");

export const Affiliates = ({ className }: { className?: string }) => (
  <LogoList
    className={cn(
      "mx-auto my-6 flex justify-center gap-6 md:justify-center md:gap-6",
      className,
    )}
    logos={affiliateLogos}
  />
);

export const Sponsors = ({
  className,
  includeAffiliates = false,
  heading,
}: {
  className?: string;
  includeAffiliates?: boolean;
  heading?: string;
}) => (
  <div className={className}>
    {includeAffiliates && (
      <LogoList className="md:justify-center md:gap-8" logos={affiliateLogos} />
    )}
    {heading && (
      <h3 className="mb-4 text-center font-medium text-gray-500 text-sm">
        {heading}
      </h3>
    )}
    <LogoList logos={sponsorLogos} shuffle />
  </div>
);
