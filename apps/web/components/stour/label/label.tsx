import cn from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

const Label = ({ children, className, as: Component = "span" }: Props) => (
  <Component
    className={cn(
      "font-medium text-gray-600 text-sm uppercase tracking-widest",
      className,
    )}
  >
    {children}
  </Component>
);

export default Label;
