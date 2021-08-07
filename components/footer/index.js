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
  const FooterHeading = ({ children }) => (
    <div className="mb-4 text-xs font-bold tracking-widest uppercase opacity-80 text-blue-50">
      {children}
    </div>
  );
  const FooterItemList = ({ data }) => {
    return data.map((item, index) => {
      return (
        <Link key={index} href={item.href} passHref>
          <a
            href="#"
            className="block my-3 text-sm font-medium duration-100 text-blue-50 opacity-70 hover:opacity-100"
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
          <a href="#" className="mr-4">
            <item.icon size={18} />
          </a>
        </Link>
      );
    });
  };
  return (
    <footer className="text-white bg-blue-900 border-t">
      <Container>
        <div className="flex flex-wrap py-24 justify-left">
          <div className="w-1/2 sm:w-4/12 md:w-3/12 text-blue-50 opacity-60">
            <Crest className="h-12 mb-6 md:h-24" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold">Sudbury Rowing Club</p>
              <p>Quay Lane</p>
              <p>Sudbury</p>
              <p>CO10 2AN</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap pb-24 justify-left">
          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <FooterHeading>About</FooterHeading>
            <FooterItemList data={footerAbout} />
          </div>

          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <FooterHeading>Regatta</FooterHeading>
            <FooterItemList data={footerRegatta} />
          </div>

          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <FooterHeading>Community</FooterHeading>
            <FooterItemList data={communityFooter} />
          </div>
          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <FooterHeading>Miscellany</FooterHeading>
            <FooterItemList data={misc} />
          </div>
        </div>
        <div className="pt-2">
          <div className="flex flex-col py-5 m-auto text-sm md:flex-row">
            <div className="mt-2">
              © Sudbury Rowing Club 2021. This site is open-source and was{" "}
              <Link href="https://willkerry.com/">
                <a className="transition opacity-60 hover:opacity-100">
                  provided for free
                </a>
              </Link>
              .
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
