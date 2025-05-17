import { cn } from "@/lib/utils";
import Image from "next/image";
import abglass from "../../../public/assets/logos/ab-glass-home-improvement.svg";
import ashtons from "../../../public/assets/logos/ashtons.svg";
import britishRowing from "../../../public/assets/logos/british-rowing.svg";
import errc from "../../../public/assets/logos/errc.svg";
import mooreGreen from "../../../public/assets/logos/moore-green.svg";
import swan from "../../../public/assets/logos/swan-at-lavenham.svg";
import { LogoList } from "./LogoList";

export type SponsorLogo = {
  logo: React.ReactNode;
  href: string;
  name: string;
  type: "sponsor" | "affiliate";
};

export const logos: SponsorLogo[] = [
  {
    logo: (
      <Image
        src={abglass}
        alt=""
        aria-hidden
        className="h-8 w-auto select-none pb-1.5 lg:h-9"
      />
    ),
    href: "https://www.abglasshomeimprovements.co.uk/",
    name: "A&B Glass Home Improvements",
    type: "sponsor",
  },
  {
    logo: (
      <Image
        src={mooreGreen}
        alt=""
        aria-hidden
        className="h-4 w-auto select-none lg:h-5"
      />
    ),
    href: "https://www.mooregreen.co.uk/",
    name: "Moore Green",
    type: "sponsor",
  },
  {
    logo: (
      <Image
        src={ashtons}
        alt=""
        aria-hidden
        className="h-7 w-auto select-none lg:h-8"
      />
    ),
    href: "https://www.ashtonslegal.co.uk/",
    name: "Ashtons",
    type: "sponsor",
  },
  {
    logo: (
      <Image
        src={swan}
        alt=""
        aria-hidden
        className="h-9 w-auto select-none pb-1 lg:h-11"
      />
    ),
    href: "https://theswanatlavenham.co.uk/?utm_source=website&utm_medium=listing&utm_campaign=sudbury_rowing_club",
    name: "The Swan at Lavenham",
    type: "sponsor",
  },
  {
    logo: (
      <Image
        src={britishRowing}
        alt=""
        aria-hidden
        className="h-6 w-auto select-none"
      />
    ),
    href: "https://britishrowing.org/",
    name: "British Rowing",
    type: "affiliate",
  },
  {
    logo: (
      <Image src={errc} alt="" aria-hidden className="h-5 w-auto select-none" />
    ),
    href: "http://easternregionrowing.org.uk/",
    name: "Eastern Region Rowing Council",
    type: "affiliate",
  },
];

const sponsorLogos = logos.filter(({ type }) => type === "sponsor");
const affiliateLogos = logos.filter(({ type }) => type === "affiliate");

export const Affiliates = ({ className }: { className?: string }) => (
  <LogoList
    logos={[
      {
        logo: (
          <div className="flex items-center pt-1 font-medium text-gray-500 text-xs leading-none">
            Affiliated with{" "}
          </div>
        ),
        href: "",
        name: "",
        type: "affiliate",
      },
      ...affiliateLogos,
    ]}
    className={cn(
      "mx-auto my-6 flex justify-center gap-6 md:justify-center md:gap-6",
      className,
    )}
  />
);

const Sponsors = ({
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
      <LogoList logos={affiliateLogos} className="md:justify-center md:gap-8" />
    )}
    {heading && (
      <h3 className="mb-4 text-center font-medium text-gray-500 text-sm">
        {heading}
      </h3>
    )}
    <LogoList shuffle logos={sponsorLogos} />
  </div>
);

export default Sponsors;
