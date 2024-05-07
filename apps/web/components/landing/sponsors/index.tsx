import { useEffect, useState } from "react";
import Image from "next/image";
import { shuffle } from "radash";
import { cn } from "@/lib/utils";
import Label from "@/components/stour/label";
import abglass from "../../../public/assets/logos/ab-glass-home-improvement.svg";
import ashtons from "../../../public/assets/logos/ashtons.svg";
import britishRowing from "../../../public/assets/logos/british-rowing.svg";
import errc from "../../../public/assets/logos/errc.svg";
import mooreGreen from "../../../public/assets/logos/moore-green.svg";
import rowperfect from "../../../public/assets/logos/rowperfect.svg";
import swan from "../../../public/assets/logos/swan-at-lavenham.svg";

interface SponsorLogo {
  logo: any;
  href: string;
  name: string;
  type: "sponsor" | "affiliate";
}

const logos: SponsorLogo[] = [
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
        className="h-8 w-auto select-none"
      />
    ),
    href: "https://britishrowing.org/",
    name: "British Rowing",
    type: "affiliate",
  },
  {
    logo: (
      <Image src={errc} alt="" aria-hidden className="h-7 w-auto select-none" />
    ),
    href: "http://easternregionrowing.org.uk/",
    name: "Eastern Region Rowing Council",
    type: "affiliate",
  },
  {
    logo: (
      <Image
        src={rowperfect}
        alt=""
        aria-hidden
        className="h-3 w-auto select-none lg:h-3.5"
      />
    ),
    href: "https://www.rowperfect.co.uk/",
    name: "Rowperfect",
    type: "affiliate",
  },
];
const LogoListItem = ({ logo, href, name }: SponsorLogo) => (
  <li key={`${href}${name}`}>
    <a href={href} aria-label={name} target="_blank" rel="noopener noreferrer">
      {logo}
    </a>
  </li>
);

const LogoList = ({
  logos,
  className,
}: {
  logos: SponsorLogo[];
  className?: string;
}) => (
  <ul
    className={cn(
      "space-between mb-12 flex flex-wrap items-center justify-center gap-10 md:justify-between md:gap-4",
      className,
    )}
  >
    {logos.map((logo) => (
      <LogoListItem key={logo.name} {...logo} />
    ))}
  </ul>
);

const sponsorLogos = logos.filter(({ type }) => type === "sponsor");
const affiliateLogos = logos.filter(({ type }) => type === "affiliate");

const Sponsors = ({ excludeAffiliates = false }) => {
  const [shuffledSponsorLogos, setShuffledSponsorLogos] =
    useState(sponsorLogos);

  useEffect(() => {
    setShuffledSponsorLogos(shuffle(sponsorLogos));
  }, []);

  return (
    <>
      {!excludeAffiliates && (
        <LogoList
          logos={affiliateLogos}
          className="md:justify-center md:gap-8"
        />
      )}
      {!excludeAffiliates && (
        <Label as="h3" className="mb-4 mt-10 text-center">
          Sponsors
        </Label>
      )}
      <LogoList logos={shuffledSponsorLogos} />
    </>
  );
};

export default Sponsors;
