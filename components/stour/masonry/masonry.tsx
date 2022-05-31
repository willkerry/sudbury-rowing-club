import cn from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Masonry = ({ children, className }: Props) => (
  <div
    className={cn(
      "box-border mx-auto md:masonry-2-col lg:masonry-3-col before:box-inherit after:box-inherit",
      className
    )}
  >
    {children}
  </div>
);

export default Masonry;
