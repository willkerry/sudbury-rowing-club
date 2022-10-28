import Link from "next/link";
import { Icon } from "react-feather";

type Props = {
  data: {
    href: string;
    icon: Icon;
    name: string;
  }[];
};

const SocialIcons = ({ data }: Props) => (
  <>
    {data.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        passHref
        className="mr-4 text-gray-400 transition hover:text-black"
      >
        <>
          <span className="sr-only">{item.name}</span>
          <item.icon size={18} strokeWidth={1.5} />
        </>
      </Link>
    ))}
  </>
);

export default SocialIcons;
