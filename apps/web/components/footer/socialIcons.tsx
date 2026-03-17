import Link from "next/link";
import { socials } from "@/components/nav/nav-data";

export const SocialIcons = () => (
  <>
    {socials.map((item) => (
      <Link
        className="mr-4 rounded-sm text-gray-400 transition hover:text-black focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
        href={item.href}
        key={item.href}
      >
        <span className="sr-only">{item.name}</span>
        {item.icon && <item.icon aria-hidden className="w-4 stroke-[1.5px]" />}
      </Link>
    ))}
  </>
);
