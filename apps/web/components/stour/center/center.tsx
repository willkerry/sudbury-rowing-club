import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  h?: boolean;
  v?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Center = forwardRef<HTMLDivElement, Props>(
  ({ className, h, v, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-full flex-1 flex-col items-center justify-center",
        h && "h-full",
        v && "v-full",
        className,
      )}
      {...props}
    />
  ),
);
Center.displayName = "Center";

export default Center;
