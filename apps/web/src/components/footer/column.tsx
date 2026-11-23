import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
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
  <div>
    <h3 className="text-sm font-medium text-gray-900">{heading}</h3>
    <ul className="mt-4 space-y-3">
      {data.map((item) => {
        const Arrow =
          item.target === "_blank" ? IconArrowUpRight : IconArrowRight;

        return (
          <li key={item.href}>
            <Link
              className="group inline-flex items-center gap-1 text-sm text-gray-600 transition-colors duration-150 hover:text-gray-900"
              href={item.href}
              target={item.target}
            >
              {item.shortName ? item.shortName : item.name}

              <Arrow className="size-3 stroke-3 text-blue-400 opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100" />
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);
