import cn from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Masonry = ({ children, className }: Props) => (
  <div
    className={cn(
      "sm:masonry-2-col lg:masonry-3-col before:box-inherit after:box-inherit mx-auto box-border",
      className,
    )}
  >
    {children}
  </div>
);
