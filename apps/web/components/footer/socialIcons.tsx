import { socials } from "@/components/nav/nav-data";
import Link from "next/link";

const SocialIcons = () => (
  <>
    {socials.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="mr-4 text-gray-400 transition hover:text-black"
      >
        <span className="sr-only">{item.name}</span>
        {item.icon && <item.icon aria-hidden className="w-4 stroke-[1.5px]" />}
      </Link>
    ))}
  </>
);

export default SocialIcons;
