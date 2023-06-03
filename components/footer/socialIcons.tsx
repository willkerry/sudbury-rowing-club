import Link from "next/link";

import { socials } from "@/components/nav/nav-data";
import { Fragment } from "react";

const SocialIcons = () => (
  <>
    {socials.map((item) => {
      const Icon = item.icon || Fragment;

      return (
        <Link
          key={item.href}
          href={item.href}
          className="mr-4 text-gray-400 transition hover:text-black"
        >
          <span className="sr-only">{item.name}</span>
          <Icon size={18} strokeWidth={1.5} aria-hidden />
        </Link>
      );
    })}
  </>
);

export default SocialIcons;
