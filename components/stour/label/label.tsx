import cn from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

const Label = ({ children, className, as: Component = "span" }: Props) => (
  <Component
    className={cn(
      "text-sm font-medium tracking-widest text-gray-600 uppercase",
      className
    )}
  >
    {children}
  </Component>
);

export default Label;
