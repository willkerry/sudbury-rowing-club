import { ScrollLink } from "@/components/utils/scroll-link";
import Image, { type StaticImageData } from "next/image";

type OverviewType = {
  title: string;
  subtitle: string;
  content: string[];
  image?: {
    src: StaticImageData;
    alt: string;
  };
};

interface OverviewProps {
  items: OverviewType[];
}

export const Overview = ({ items }: OverviewProps) => (
  <div className="my-24 gap-16 sm:grid sm:grid-cols-12">
    <div className="hidden sm:col-span-4 sm:block">
      <ul className="sticky top-36 space-y-4 md:space-y-6">
        {items.map(({ title, subtitle }) => (
          <li key={title}>
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
            <div className="hidden text-gray-500 text-sm md:block">
              {subtitle}
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="prose col-span-8">
      {items.map(({ title, content, image }) => (
        <div key={title} id={title}>
          {image && (
            <div className="flex overflow-hidden">
              <Image
                alt={image.alt}
                height={(635 / image.src.width) * image.src.height}
                placeholder="blur"
                src={image.src}
                width={635}
                className="rounded-sm shadow-sm"
              />
            </div>
          )}
          <h3>{title}</h3>
          <div className="pb-10">
            {content.map((paragraph) => (
              <p key={paragraph.substring(4, 9)}>{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
