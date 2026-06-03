import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import type { HTMLAttributeAnchorTarget } from "react";

type Props = {
  heading: string;
  data: {
    name: string;
    shortName?: string;
    href: string;
    target?: HTMLAttributeAnchorTarget;
  }[];
};

export const FooterColumn = ({ heading, data }: Props) => (
  <div className="mb-12 w-1/2 text-gray-700 sm:w-4/12 md:w-3/12">
    <h3 className="mb-3 select-none font-semibold text-xs uppercase tracking-widest">
      {heading}
    </h3>
    {data.map((item) => {
      const Arrow =
        item.target === "_blank" ? ArrowUpRightIcon : ArrowRightIcon;

      return (
        <Link
          className="group my-3 flex items-center text-gray-600 text-sm transition-[color,font-weight] hover:font-[450] hover:text-black"
          href={item.href}
          key={item.href}
          target={item.target}
        >
          {item.shortName ? item.shortName : item.name}

          <Arrow className="h-3 w-3 stroke-3 text-blue-400 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
        </Link>
      );
    })}
  </div>
);
