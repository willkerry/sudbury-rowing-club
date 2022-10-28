import Link from "next/link";
import { type IconNavItemType } from "@/types/nav-item";

type Props = { CTAs: IconNavItemType[] };

const CTAList = ({ CTAs }: Props) => {
  return (
    <>
      {CTAs.map((cta) => (
        <div key={cta.href} className="flow-root">
          <Link
            href={cta.href}
            className="flex group items-center p-2.5 -m-2.5 text-base font-medium text-gray-700 hover:text-gray-900 rounded hover:bg-gray-600 hover:bg-opacity-10 hover:shadow-inner transition"
          >
            <>
              <cta.icon
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition group-hover:text-blue-600 drop-shadow"
                aria-hidden="true"
              />
              <div className="ml-2.5 whitespace-nowrap">{cta.name}</div>
            </>
          </Link>
        </div>
      ))}
    </>
  );
};

export default CTAList;
