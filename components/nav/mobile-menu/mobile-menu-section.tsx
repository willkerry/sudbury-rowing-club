import cn from "classnames";
import { type NavItemType, type IconNavItemType } from "@/types/nav-item";
import { CompactMobileMenuItem, MobileMenuItem } from "./mobile-menu-item";

type CompactSectionProps = {
  title: string;
  data: NavItemType[];
};
type SectionProps = {
  title: string;
  data: IconNavItemType[];
};

const SectionWrapper = ({
  title,
  compact,
  children,
}: {
  title: string;
  compact?: boolean;
  children: React.ReactNode;
}) => (
  <div className="px-5 pt-4 pb-6">
    <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
      {title}
    </div>
    <div className="mt-3">
      <nav
        className={cn(
          "grid grid-cols-2 sm:grid-cols-6 gap-x-6",
          compact ? "gap-y-3" : "gap-y-6"
        )}
      >
        {children}
      </nav>
    </div>
  </div>
);

export const MobileMenuSection = ({ title, data }: SectionProps) => (
  <SectionWrapper title={title} compact={false}>
    {data.map((item, i) => (
      <MobileMenuItem data={item} key={i} />
    ))}
  </SectionWrapper>
);
export const CompactMobileMenuSection = ({
  title,
  data,
}: CompactSectionProps) => (
  <SectionWrapper title={title} compact={true}>
    {data.map((item, i) => (
      <CompactMobileMenuItem data={item} key={i} />
    ))}
  </SectionWrapper>
);
