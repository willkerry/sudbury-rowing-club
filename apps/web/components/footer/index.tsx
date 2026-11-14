import { Crest } from "@sudburyrc/blue";
import Link from "next/link";
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
import { RiverStatus } from "./river-status";
import { SocialIcons } from "./socialIcons";

const columns: [string, IconNavItemType[]][] = [
  ["About", about],
  ["Regatta", regatta],
  ["Community", [...members.filter((item) => item.cta), ...socials]],
  ["Miscellany", misc],
];

export const Footer = () => (
  <footer className="bg-gray-50">
    <Container className="pt-20 md:pt-24">
      <h2 className="sr-only">Footer</h2>

      <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-3">
          <Link
            aria-label="Home"
            className="mb-6 inline-block rounded-sm transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden active:scale-[0.97]"
            href="/"
          >
            <Crest aria-hidden className="h-14 text-blue-950 md:h-16" />
          </Link>
          <Address />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 md:col-span-9">
          {columns.map(([heading, data]) => (
            <FooterColumn
              data={data.map((item) => ({
                ...item,
                target: item.href.startsWith("http") ? "_blank" : undefined,
              }))}
              heading={heading}
              key={heading}
            />
          ))}
        </div>
      </div>

      <RiverStatus className="mt-16" />

      <div className="flex items-center justify-between gap-6 pt-8 pb-12 text-sm text-gray-500">
        <p>
          © Sudbury Rowing Club {new Date().getFullYear()}. <ReportABug />
        </p>
        <div className="flex shrink-0">
          <SocialIcons />
        </div>
      </div>
    </Container>
  </footer>
);
