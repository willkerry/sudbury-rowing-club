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
    logo: <Specflue className="max-h-7 w-full" />,
    href: "https://specflue.com/",
    name: "Specflue",
  },
  {
    logo: <Rowperfect className="max-h-4 w-full" />,
    href: "https://www.rowperfect.co.uk/",
    name: "Rowperfect",
  },
  {
    logo: <BritishRowing className="max-h-8 w-full" />,
    href: "https://britishrowing.org/",
    name: "British Rowing",
  },
  {
    logo: <Errc className="max-h-7 w-full" />,
    href: "http://easternregionrowing.org.uk/",
    name: "Easter Region Rowing Council",
  },
];

const Sponsors = () => (
  <ul className="space-between my-12 flex flex-wrap items-center justify-center gap-8">
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
