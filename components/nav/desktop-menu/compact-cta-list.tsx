import Link from "next/link";
import { type IconNavItemType } from "@/types/nav-item";

type Props = { CTAs: IconNavItemType[] };

const CompactCTAList = ({ CTAs }: Props) => {
  return <>
    {CTAs.map((cta) => (
      <div key={cta.href} className="flow-root">
        <Link
          href={cta.href}
          className="flex items-center p-2 -m-2 text-sm font-medium text-gray-700 transition rounded-r rounded-l-3xl group hover:text-gray-900 hover:bg-black hover:bg-opacity-5 hover:shadow-inner">

          <cta.icon
            className="flex-shrink-0 w-6 h-6 p-1 text-gray-500 rounded-full shadow backdrop-brightness-125 group-hover:text-gray-800"
            aria-hidden="true"
          />
          <span className="ml-1.5">{cta.name}</span>

        </Link>
      </div>
    ))}
  </>;
};

export default CompactCTAList;
