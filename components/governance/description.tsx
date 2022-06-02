import cn from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Description = ({ children, className }: Props) => (
  <div className={cn("text-gray-700", className)}>{children}</div>
);

export default Description;
