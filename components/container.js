import cn from "classnames";

export default function Container({ children, className, ...props }) {
  return (
    <div className={cn("container mx-auto px-5", className)} {...props}>
      {children}
    </div>
  );
}
