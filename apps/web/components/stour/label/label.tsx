import cn from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

const Label = ({ children, className, as: Component = "span" }: Props) => (
  <Component
    className={cn(
      "inline-block text-sm font-medium uppercase leading-tight tracking-widest text-gray-600",
      className,
    )}
  >
    {children}
  </Component>
);

export default Label;
