import BritishRowing from "@/components/landing/sponsors/british-rowing";
import Errc from "@/components/landing/sponsors/errc";
import Rowperfect from "@/components/landing/sponsors/rowperfect";
import Specflue from "@/components/landing/sponsors/specflue";
import Link from "next/link";

const SponsorLogos = [
  {
    logo: <Specflue className="w-full max-h-7" />,
    href: "https://specflue.com/",
    name: "Specflue",
  },
  {
    logo: <Rowperfect className="w-full max-h-4" />,
    href: "https://www.rowperfect.co.uk/",
    name: "Rowperfect",
  },
  {
    logo: <BritishRowing className="w-full max-h-8" />,
    href: "https://britishrowing.org/",
    name: "British Rowing",
  },
  {
    logo: <Errc className="w-full max-h-7" />,
    href: "http://easternregionrowing.org.uk/",
    name: "Easter Region Rowing Council",
  },
];

function Sponsors() {
  return (
    <ul className="flex items-center justify-center gap-8 my-12 space-between">
      {SponsorLogos.map(({ logo, href, name }, index) => (
        <li key={index}>
        <Link href={href}>
          <a aria-label={name}>
            {logo}
          </a>
        </Link>
        </li>
      ))}
    </ul>
  );
}
export default Sponsors;
