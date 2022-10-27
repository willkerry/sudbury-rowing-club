import Link from "next/link";

type Props = {
  heading: string;
  data: {
    name: string;
    shortName?: string;
    href: string;
  }[];
};

const FooterColumn = ({ heading, data }: Props) => (
  <div className="w-1/2 mb-12 text-gray-700 sm:w-4/12 md:w-3/12">
    <div className="mb-4 text-xs font-semibold tracking-widest uppercase select-none">
      {heading}
    </div>
    {data.map((item) => (
      (<Link
        key={item.href}
        href={item.href}
        passHref
        className="block my-3 text-sm text-gray-500 duration-100 hover:text-black">

        {item.shortName ? item.shortName : item.name}

      </Link>)
    ))}
  </div>
);

export default FooterColumn;