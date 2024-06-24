"use client";

import Container from "@/components/layouts/container";
import Crest from "@/components/logo/crest";
import {
  about,
  members,
  misc,
  regatta,
  socials,
} from "@/components/nav/nav-data";
import Address from "./address";
import FooterColumn from "./column";
import ReportABug from "./reportABug";
import SocialIcons from "./socialIcons";

const communityFooter = [...members.filter((item) => item.cta), ...socials];

export default function Footer() {
  const date = new Date();
  return (
    <footer className="border-t">
      <Container>
        <h2 className="sr-only">Footer</h2>
        <div className="justify-left flex flex-wrap py-16">
          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <Crest aria-hidden className="mb-6 h-12 text-gray-600 md:h-16" />
            <Address />
          </div>
        </div>
        <div className="justify-left mb-12 flex flex-wrap">
          <FooterColumn heading="About" data={about} />
          <FooterColumn heading="Regatta" data={regatta} />
          <FooterColumn heading="Community" data={communityFooter} />
          <FooterColumn heading="Miscellany" data={misc} />
        </div>
        <div className="pt-2">
          <div className="m-auto flex justify-between py-5 text-sm text-gray-500 md:flex-row">
            <div className="mt-2">
              © Sudbury Rowing Club {date.getFullYear()}. <ReportABug />
            </div>
            <div className="mt-2 flex flex-row">
              <SocialIcons />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
