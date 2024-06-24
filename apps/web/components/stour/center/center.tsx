import { forwardRef } from "react";
import cn from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  h?: boolean;
  v?: boolean;
};

const Center = forwardRef<HTMLDivElement, Props>(
  ({ children, className, h, v, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-full flex-1 flex-col items-center justify-center",
        h && `h-full`,
        v && `v-full`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
Center.displayName = "Center";

export default Center;
