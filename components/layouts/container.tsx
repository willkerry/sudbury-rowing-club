import cn from "classnames";

type Props = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Container = ({ children, className, ...props }: Props) => (
  <div
    className={cn("container max-w-screen-lg mx-auto px-5", className)}
    {...props}
  >
    {children}
  </div>
);

export default Container;
