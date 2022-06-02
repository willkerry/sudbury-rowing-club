import Link from "next/link";
import { type IconNavItemType } from "@/types/nav-item";

type Props = { CTAs: IconNavItemType[] };

const CompactCTAList = ({ CTAs }: Props) => {
  return (
    <>
      {CTAs.map((cta) => (
        <div key={cta.href} className="flow-root">
          <Link href={cta.href}>
            <a className="flex items-center p-2 -m-2 text-sm font-medium text-gray-900 rounded hover:bg-gray-200">
              <cta.icon
                className="flex-shrink-0 w-6 h-6 p-1 text-gray-600 bg-white border rounded-lg shadow-sm"
                aria-hidden="true"
              />
              <span className="ml-1.5">{cta.name}</span>
            </a>
          </Link>
        </div>
      ))}
    </>
  );
};

export default CompactCTAList;
