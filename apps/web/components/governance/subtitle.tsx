import cn from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const SubTitle = ({ className, children }: Props) => (
  <h3 className={cn("mb-0.5 font-semibold text-gray-900", className)}>
    {children}
  </h3>
);

export default SubTitle;
