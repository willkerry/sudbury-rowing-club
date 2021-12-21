import Container from "@/components/container";
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
import Link from "next/link";

const footerAbout = [...about, ...aboutCTAs];
const footerRegatta = [...regatta, ...regattaCTAs];
const communityFooter = [...memberCTAs, ...socials];

export default function Footer() {
  function FooterColumn({ heading, data }) {
    return (
      <div className="w-1/2 text-gray-700 sm:w-4/12 md:w-3/12">
        <FooterHeading>{heading}</FooterHeading>
        <FooterItemList data={data} />
      </div>
    );
  }
  const FooterHeading = ({ children }) => (
    <div className="mb-4 text-xs font-semibold tracking-widest uppercase select-none">
      {children}
    </div>
  );
  const FooterItemList = ({ data }) => {
    return data.map((item, index) => {
      return (
        <Link key={index} href={item.href} passHref>
          <a
            href="#"
            className="block my-3 text-sm text-gray-500 duration-100 hover:text-black"
          >
            {item.shortName ? item.shortName : item.name}
          </a>
        </Link>
      );
    });
  };
  const SocialIcons = ({ data }) => {
    return data.map((item, index) => {
      return (
        <Link key={index} href={item.href} passHref>
          <a
            href="#"
            className="mr-4 text-gray-400 transition hover:text-black"
          >
            <item.icon size={18} strokeWidth={1.5} />
          </a>
        </Link>
      );
    });
  };
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
        <div className="flex flex-wrap pb-24 justify-left">
          <FooterColumn heading="About" data={footerAbout} />
          <FooterColumn heading="Regatta" data={footerRegatta} />
          <FooterColumn heading="Community" data={communityFooter} />
          <FooterColumn heading="Miscellany" data={misc} />
        </div>

        <div className="pt-2">
          <div className="flex flex-col justify-between py-5 m-auto text-sm text-gray-500 md:flex-row">
            <div className="mt-2">
              © Sudbury Rowing Club 2021.{" "}
              <Link href="https://willkerry.com/">
                <a className="transition hover:text-black">
                  Website by{" "}
                  <svg
                    viewBox="0 0 24 24"
                    width="18.5"
                    height="18.5"
                    fill="currentColor"
                    className="inline-flex mb-0.5"
                  >
                    <path d="M0 5h3.5l4 9.5L6 18H5zM7 5h3.5l4 9.5L13 18h-1zM16 13.5l4 4.5h4l-6.5-8zM18 8.5L19.5 5H24l-5 3.5z"/>
                  </svg>
                  .
                </a>
              </Link>
            </div>

            <div className="flex flex-row mt-2 md:flex-auto md:flex-row-reverse">
              <SocialIcons data={socials} />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
