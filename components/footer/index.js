import Link from "next/link";
import PropTypes from "prop-types";
import Container from "@/components/layouts/container";
import Crest from "@/components/logo/crest";
import {
  about,
  aboutCTAs,
  memberCTAs,
  regatta,
  regattaCTAs,
  socials,
  misc,
} from "@/components/nav-bar/nav-data";

const footerAbout = [...about, ...aboutCTAs];
const footerRegatta = [...regatta, ...regattaCTAs];
const communityFooter = [...memberCTAs, ...socials];

function FooterColumn({ heading, data }) {
  return (
    <div className="w-1/2 mb-12 text-gray-700 sm:w-4/12 md:w-3/12">
      <FooterHeading>{heading}</FooterHeading>
      <FooterItemList data={data} />
    </div>
  );
}
FooterColumn.propTypes = {
  heading: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      shortName: PropTypes.string,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
function FooterHeading({ children }) {
  return (
    <div className="mb-4 text-xs font-semibold tracking-widest uppercase select-none">
      {children}
    </div>
  );
}
FooterHeading.propTypes = {
  children: PropTypes.node.isRequired,
};

const FooterItemList = ({ data }) =>
  data.map((item) => (
    <Link key={item.href} href={item.href} passHref>
      <a
        href="#"
        className="block my-3 text-sm text-gray-500 duration-100 hover:text-black"
      >
        {item.shortName ? item.shortName : item.name}
      </a>
    </Link>
  ));
FooterItemList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      shortName: PropTypes.string,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const SocialIcons = ({ data }) =>
  data.map((item) => (
    <Link key={item.href} href={item.href} passHref>
      <a href="#" className="mr-4 text-gray-400 transition hover:text-black">
        <span className="sr-only">{item.name}</span>
        <item.icon size={18} strokeWidth={1.5} />
      </a>
    </Link>
  ));
SocialIcons.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ).isRequired,
};

export default function Footer() {
  const userAgent =
    typeof window === "undefined" ? null : window.navigator.userAgent;
  const currentPath =
    typeof window === "undefined" ? null : window.location.pathname;
  return (
    <footer className="border-t">
      <Container>
        <div className="flex flex-wrap py-16 justify-left">
          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <Crest className="h-12 mb-6 text-gray-600 md:h-16" />
            <div className="space-y-1 text-sm text-gray-500">
              <p className="font-medium text-gray-800">Sudbury Rowing Club</p>
              <p>Quay Lane</p>
              <p>Sudbury</p>
              <p>CO10 2AN</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mb-12 justify-left">
          <FooterColumn heading="About" data={footerAbout} />
          <FooterColumn heading="Regatta" data={footerRegatta} />
          <FooterColumn heading="Community" data={communityFooter} />
          <FooterColumn heading="Miscellany" data={misc} />
        </div>

        <div className="pt-2">
          <div className="flex justify-between py-5 m-auto text-sm text-gray-500 md:flex-row">
            <div className="mt-2">
              © Sudbury Rowing Club {new Date().getFullYear()}.{" "}
              <Link
                href={`http://localhost:3000/contact?to=5b54081d-46f0-485b-83c2-691e086fdf19&message=User-Agent: ${userAgent}. Path: ${currentPath}. Please describe the bug below:`}
              >
                <a className="transition hover:text-black">Report a bug.</a>
              </Link>
            </div>

            <div className="flex flex-row mt-2">
              <SocialIcons data={socials} />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
