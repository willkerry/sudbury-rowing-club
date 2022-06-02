import Link from "next/link";
import { type IconNavItemType } from "@/types/nav-item";

type Props = { CTAs: IconNavItemType[] };

const CTAList = ({ CTAs }: Props) => {
  return (
    <>
      {CTAs.map((cta) => (
        <div key={cta.href} className="flow-root">
          <Link href={cta.href} passHref>
            <a className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 rounded-md hover:bg-gray-200">
              <cta.icon
                className="flex-shrink-0 w-6 h-6 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-3">{cta.name}</span>
            </a>
          </Link>
        </div>
      ))}
      ;
    </>
  );
};

export default CTAList;
