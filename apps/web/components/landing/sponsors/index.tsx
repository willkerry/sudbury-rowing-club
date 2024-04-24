import { shuffle } from "radash";
import { cn } from "@/lib/utils";
import BritishRowing from "@/components/landing/sponsors/british-rowing";
import Errc from "@/components/landing/sponsors/errc";
import Rowperfect from "@/components/landing/sponsors/rowperfect";
import ABGlass from "./ab-glass";
import Ashtons from "./ashtons";
import MooreGreen from "./moore-green";
import Swan from "./swan";

interface SponsorLogo {
  logo: React.ReactElement;
  href: string;
  name: string;
  type: "sponsor" | "affiliate";
}

const logos: SponsorLogo[] = [
  {
    logo: <Rowperfect aria-hidden className="h-3 lg:h-4" />,
    href: "https://www.rowperfect.co.uk/",
    name: "Rowperfect",
    type: "sponsor",
  },
  {
    logo: <ABGlass aria-hidden className="h-8 pb-1.5 lg:h-9" />,
    href: "https://www.abglasshomeimprovements.co.uk/",
    name: "A&B Glass Home Improvements",
    type: "sponsor",
  },
  {
    logo: <MooreGreen aria-hidden className="h-4 lg:h-5" />,
    href: "https://www.mooregreen.co.uk/",
    name: "Moore Green",
    type: "sponsor",
  },
  {
    logo: <Ashtons aria-hidden className="h-7 lg:h-8" />,
    href: "https://www.ashtonslegal.co.uk/",
    name: "Ashtons",
    type: "sponsor",
  },
  {
    logo: <Swan aria-hidden className="h-9 pb-1 lg:h-11" />,
    href: "https://theswanatlavenham.co.uk/?utm_source=website&utm_medium=listing&utm_campaign=sudbury_rowing_club",
    name: "The Swan at Lavenham",
    type: "sponsor",
  },
  {
    logo: <BritishRowing aria-hidden className="h-8" />,
    href: "https://britishrowing.org/",
    name: "British Rowing",
    type: "affiliate",
  },
  {
    logo: <Errc aria-hidden className="h-7" />,
    href: "http://easternregionrowing.org.uk/",
    name: "Eastern Region Rowing Council",
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
      "space-between my-12 flex flex-wrap items-center justify-center gap-10 md:justify-between md:gap-4",
      className,
    )}
  >
    {logos.map((logo) => (
      <LogoListItem key={logo.name} {...logo} />
    ))}
  </ul>
);

const sponsorLogos = shuffle(logos.filter(({ type }) => type === "sponsor"));
const affiliateLogos = logos.filter(({ type }) => type === "affiliate");

const Sponsors = () => (
  <>
    <LogoList logos={sponsorLogos} />
    <LogoList logos={affiliateLogos} className="md:justify-center md:gap-8" />
  </>
);

export default Sponsors;
