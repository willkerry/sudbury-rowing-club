import cn from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const SectionTitle = ({ className, children }: Props) => (
  <h2
    className={cn(
      "mt-16 mb-6 text-2xl font-bold tracking-tight text-gray-800",
      className
    )}
  >
    {children}
  </h2>
);

export default SectionTitle;
