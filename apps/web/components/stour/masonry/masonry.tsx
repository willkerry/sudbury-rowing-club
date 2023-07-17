import cn from "@sudburyrc/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Masonry = ({ children, className }: Props) => (
  <div
    className={cn(
      "md:masonry-2-col lg:masonry-3-col before:box-inherit after:box-inherit mx-auto box-border",
      className
    )}
  >
    {children}
  </div>
);

export default Masonry;
