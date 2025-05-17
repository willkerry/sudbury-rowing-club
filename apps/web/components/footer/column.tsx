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
  <div className="mb-12 w-1/2 text-gray-700 sm:w-4/12 md:w-3/12">
    <h3 className="mb-4 select-none font-semibold text-xs uppercase tracking-widest">
      {heading}
    </h3>
    {data.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="my-3 block text-gray-500 text-sm duration-100 hover:text-black"
      >
        {item.shortName ? item.shortName : item.name}
      </Link>
    ))}
  </div>
);

export default FooterColumn;
