import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

export const Label = ({
  children,
  className,
  as: Component = "span",
}: Props) => (
  <Component
    className={cn(
      "inline-block uppercase text-sm leading-tight font-medium tracking-widest text-gray-600",
      className,
    )}
  >
    {children}
  </Component>
);
