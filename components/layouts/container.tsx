import cn from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: Props) => (
  <div className={cn("container max-w-screen-lg mx-auto px-5", className)}>
    {children}
  </div>
);

export default Container;
