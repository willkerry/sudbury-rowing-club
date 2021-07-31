import cn from "classnames";

export default function Container({ children, className, ...props }) {
  return (
    <div className={cn("container max-w-screen-lg mx-auto px-5", className)} {...props}>
      {children}
    </div>
  );
}
