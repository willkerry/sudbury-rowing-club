import cn from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const SectionTitle = ({ className, children }: Props) => (
  <h2
    className={cn(
      "mt-16 mb-6 font-bold text-2xl text-gray-800 tracking-tight",
      className,
    )}
  >
    {children}
  </h2>
);

export default SectionTitle;
