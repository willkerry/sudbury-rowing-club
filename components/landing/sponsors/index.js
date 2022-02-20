import Link from "next/link";
import PropTypes from "prop-types";
import BritishRowing from "@/components/landing/sponsors/british-rowing";
import Errc from "@/components/landing/sponsors/errc";
import Rowperfect from "@/components/landing/sponsors/rowperfect";
import Specflue from "@/components/landing/sponsors/specflue";

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

SponsorLogos.propTypes = {
  logo: PropTypes.elementType.isRequired,
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

function Sponsors() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-8 my-12 space-between">
      {SponsorLogos.map(({ logo, href, name }) => (
        <li key={`${href}${name}`}>
          <Link href={href}>
            <a aria-label={name}>{logo}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
export default Sponsors;
