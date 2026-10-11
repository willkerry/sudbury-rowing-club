import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  /** For dates and figures, which read badly in expanded type. */
  numeric?: boolean;
};

export const Label = ({
  children,
  className,
  as: Component = "span",
  numeric = false,
}: Props) => (
  <Component
    className={cn(
      "inline-block font-medium text-gray-600 text-sm leading-tight",
      numeric ? "uppercase tabular-nums tracking-widest" : "caps",
      className,
    )}
  >
    {children}
  </Component>
);
