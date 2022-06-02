import Container from "@/components/layouts/container";
import Crest from "@/components/logo/crest";
import FooterColumn from "./column";
import SocialIcons from "./socialIcons";
import Address from "./address";
import ReportABug from "./reportABug";
import {
  about,
  aboutCTAs,
  memberCTAs,
  regatta,
  regattaCTAs,
  socials,
  misc,
} from "@/components/nav/nav-data";

const footerAbout = [...about, ...aboutCTAs];
const footerRegatta = [...regatta, ...regattaCTAs];
const communityFooter = [...memberCTAs, ...socials];

export default function Footer() {
  const date = new Date();
  return (
    <footer className="border-t">
      <Container>
        <div className="flex flex-wrap py-16 justify-left">
          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <Crest className="h-12 mb-6 text-gray-600 md:h-16" />
            <Address />
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
              © Sudbury Rowing Club {date.getFullYear()}.{" "}
              <ReportABug
                userAgent={
                  typeof window === "undefined"
                    ? null
                    : window.navigator.userAgent
                }
                currentPath={
                  typeof window === "undefined"
                    ? null
                    : window.location.pathname
                }
              />
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
