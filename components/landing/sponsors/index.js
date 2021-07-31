import Link from "next/link";
import BritishRowing from "@/components/landing/sponsors/british-rowing";
import Errc from "@/components/landing/sponsors/errc";
import Rowperfect from "@/components/landing/sponsors/rowperfect";
import Specflue from "@/components/landing/sponsors/specflue";

const SponsorLogos = [
  {
    logo: <Specflue className="w-32" />,
    href: "https://specflue.com/",
    name: "Specflue",
  },
  {
    logo: <BritishRowing className="w-16" />,
    href: "https://britishrowing.org/",
    name: "British Rowing",
  },
  {
    logo: <Errc className="w-28" />,
    href: "http://easternregionrowing.org.uk/",
    name: "Easter Region Rowing Council",
  },
  {
    logo: <Rowperfect className="w-40" />,
    href: "https://www.rowperfect.co.uk/",
    name: "Rowperfect",
  },
];

function Sponsors(props) {
  return (
    <div className="flex flex-row items-center justify-between gap-4 py-16 text-gray-900">
      {SponsorLogos.map(({ logo, href, name, index }) => (
        <Link key={index} href={href}>
          <a aria-label={name}>{logo}</a>
        </Link>
      ))}
    </div>
  );
}
export default Sponsors;
