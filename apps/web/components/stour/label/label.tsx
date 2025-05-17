import cn from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

const Label = ({ children, className, as: Component = "span" }: Props) => (
  <Component
    className={cn(
      "inline-block font-medium text-gray-600 text-sm uppercase leading-tight tracking-widest",
      className,
    )}
  >
    {children}
  </Component>
);

export default Label;
