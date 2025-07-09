import { Crest } from "@sudburyrc/blue";
import { Container } from "@/components/layouts/container";
import {
  about,
  members,
  misc,
  regatta,
  socials,
} from "@/components/nav/nav-data";
import type { IconNavItemType } from "@/types/nav-item";
import { Address } from "./address";
import { FooterColumn } from "./column";
import { ReportABug } from "./reportABug";
import { SocialIcons } from "./socialIcons";

const columns: [string, IconNavItemType[]][] = [
  ["About", about],
  ["Regatta", regatta],
  ["Community", [...members.filter((item) => item.cta), ...socials]],
  ["Miscellany", misc],
];

export const Footer = () => (
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
        {columns.map(([heading, data]) => (
          <FooterColumn key={heading} heading={heading} data={data} />
        ))}
      </div>

      <div className="pt-2">
        <div className="m-auto flex justify-between py-5 text-gray-500 text-sm md:flex-row">
          <div className="mt-2">
            © Sudbury Rowing Club {new Date().getFullYear()}. <ReportABug />
          </div>
          <div className="mt-2 flex flex-row">
            <SocialIcons />
          </div>
        </div>
      </div>
    </Container>
  </footer>
);
