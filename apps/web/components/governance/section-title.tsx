import cn from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const SectionTitle = ({ className, children }: Props) => (
  <h2
    className={cn(
      "mb-6 mt-16 text-2xl font-bold tracking-tight text-gray-800",
      className,
    )}
  >
    {children}
  </h2>
);

export default SectionTitle;
