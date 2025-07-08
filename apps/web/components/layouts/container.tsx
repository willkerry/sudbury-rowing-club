import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Pad down and centre the full-width page.
 *
 * - **Definitely, definitely, definitely** use this component for page content.
 * - **Do not** use within parents that have widths, padding, or margins.
 * - **Do not** use Tailwind classes to add padding, margins, and widths.
 *
 * Modifying this component will affect *every* page.
 */
export const Container = ({ children, className, ...props }: Props) => (
  <div className={cn("container mx-auto px-4", className)} {...props}>
    {children}
  </div>
);
