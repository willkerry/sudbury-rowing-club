import Image from "next/image";
import { Link as ScrollLink } from "react-scroll";

type OverviewType = {
  title: string;
  subtitle: string;
  content: string[];
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

interface OverviewProps {
  items: OverviewType[];
}

const Overview: React.FC<OverviewProps> = ({ items }) => (
  <div className="gap-16 my-24 sm:grid sm:grid-cols-12">
    <div className="hidden sm:col-span-4 sm:block">
      <ul className="sticky space-y-4 md:space-y-6 top-36">
        {items.map(({ title, subtitle }) => (
          <li key={title}>
            <ScrollLink
              activeClass="!text-blue-500 font-semibold"
              className="font-medium text-gray-700 transition hover:text-gray-900 hover:cursor-pointer"
              duration={200}
              offset={-30}
              smooth
              spy
              to={title}
            >
              {title}
            </ScrollLink>
            <div className="hidden text-sm text-gray-500 md:block">
              {subtitle}
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="col-span-8 prose">
      {items.map(({ title, content, image }) => (
        <div key={title} id={title}>
          {image && (
            <div className="flex overflow-hidden">
              <Image
                alt={image.alt}
                height={(635 / image.width) * image.height}
                src={image.src}
                width={635}
                className="rounded shadow"
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

export default Overview;
