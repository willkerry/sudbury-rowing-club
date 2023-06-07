import Link from "next/link";
import BritishRowing from "@/components/landing/sponsors/british-rowing";
import Errc from "@/components/landing/sponsors/errc";
import Rowperfect from "@/components/landing/sponsors/rowperfect";
import Specflue from "@/components/landing/sponsors/specflue";

interface SponsorLogo {
  logo: React.ReactElement;
  href: string;
  name: string;
}

const SponsorLogos: SponsorLogo[] = [
  {
    logo: <Specflue className="h-7" />,
    href: "https://specflue.com/",
    name: "Specflue",
  },
  {
    logo: <Rowperfect className="h-4" />,
    href: "https://www.rowperfect.co.uk/",
    name: "Rowperfect",
  },
  {
    logo: <BritishRowing className="h-8" />,
    href: "https://britishrowing.org/",
    name: "British Rowing",
  },
  {
    logo: <Errc className="h-7" />,
    href: "http://easternregionrowing.org.uk/",
    name: "Easter Region Rowing Council",
  },
];

const Sponsors = () => (
  <ul className="space-between my-12 flex flex-wrap items-center justify-between gap-4">
    {SponsorLogos.map(({ logo, href, name }) => (
      <li key={`${href}${name}`}>
        <Link href={href} aria-label={name}>
          {logo}
        </Link>
      </li>
    ))}
  </ul>
);

export default Sponsors;
