import Link from "next/link";
import { type IconNavItemType } from "@/types/nav-item";

type Props = { CTAs: IconNavItemType[] };

const CTAList = ({ CTAs }: Props) => {
  return (
    <>
      {CTAs.map((cta) => (
        <div key={cta.href} className="flow-root">
          <Link href={cta.href} passHref>
            <a className="flex group items-center p-3 -m-3 text-base font-medium text-gray-900 rounded hover:bg-gray-600 hover:bg-opacity-10 hover:shadow-inner transition">
              <cta.icon
                className="flex-shrink-0 w-6 h-6 text-gray-600 group-hover:text-blue-600 transition drop-shadow"
                aria-hidden="true"
              />
              <div className="ml-3 whitespace-nowrap">{cta.name}</div>
            </a>
          </Link>
        </div>
      ))}
    </>
  );
};

export default CTAList;
