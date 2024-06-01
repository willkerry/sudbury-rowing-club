import cn from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  h?: boolean;
  v?: boolean;
};

const Center = ({ h = true, v = false, children, className }: Props) => {
  const classes = cn(
    "flex flex-col justify-center items-center",
    h && "h-full",
    v && "v-full",
    className,
  );
  return <div className={classes}>{children}</div>;
};

export default Center;
