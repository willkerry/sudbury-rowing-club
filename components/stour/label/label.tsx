import cn from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

const Label = ({ children, className, as: Component = "span" }: Props) => (
  <Component
    className={cn(
      "text-sm font-medium uppercase tracking-widest text-gray-600",
      className
    )}
  >
    {children}
  </Component>
);

export default Label;
