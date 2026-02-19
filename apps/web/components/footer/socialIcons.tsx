import Link from "next/link";
import { socials } from "@/components/nav/nav-data";

export const SocialIcons = () => (
  <>
    {socials.map((item) => (
      <Link
        className="mr-4 text-gray-400 transition hover:text-black"
        href={item.href}
        key={item.href}
      >
        <span className="sr-only">{item.name}</span>
        {item.icon && <item.icon aria-hidden className="w-4 stroke-[1.5px]" />}
      </Link>
    ))}
  </>
);
