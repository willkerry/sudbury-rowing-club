import type { JoinPage } from "@sudburyrc/api";
import { ScrollLink } from "@/components/utils/scroll-link";
import { PortableText } from "@/lib/sanity";
import { SectionImage } from "./section-image";

interface OverviewProps {
  items: JoinPage["sections"];
}

export const Overview = ({ items }: OverviewProps) => (
  <div className="my-24 gap-16 sm:grid sm:grid-cols-12">
    <div className="hidden sm:col-span-4 sm:block">
      <ul className="sticky top-36 space-y-4 md:space-y-6">
        {items.map(({ _key, title, subtitle }) => (
          <li key={_key}>
            <ScrollLink
              activeClass="text-blue-500! font-semibold"
              className="font-medium text-gray-700 transition hover:cursor-pointer hover:text-gray-900"
              duration={200}
              offset={-30}
              smooth
              spy
              to={title}
            >
              {title}
            </ScrollLink>
            {subtitle && (
              <div className="hidden text-sm text-gray-500 md:block">
                {subtitle}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
    <div className="col-span-8 prose">
      {items.map(({ _key, title, content, image }) => (
        <div id={title} key={_key}>
          {image && (
            <div className="flex overflow-hidden">
              <SectionImage image={image} />
            </div>
          )}
          <h3>{title}</h3>
          <PortableText value={content} wrapperProps={{ className: "pb-10" }} />
        </div>
      ))}
    </div>
  </div>
);
