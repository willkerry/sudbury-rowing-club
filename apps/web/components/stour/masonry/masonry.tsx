import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Masonry = ({ children, className }: Props) => (
  <div
    className={cn(
      "before:box-inherit after:box-inherit mx-auto box-border sm:masonry-2-col lg:masonry-3-col",
      className,
    )}
  >
    {children}
  </div>
);
