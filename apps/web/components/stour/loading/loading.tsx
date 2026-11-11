import { cn } from "@/lib/utils";
import styles from "./loading.module.css";

type LoadingProps = {
  className?: string;
  children?: React.ReactNode;
  visible?: boolean;
};

const Dot = () => (
  <i
    className={`mx-0.5 inline-block h-1 w-1 rounded-full bg-gray-600 ${styles.dots}`}
  />
);

export const Loading = ({
  className,
  children,
  visible = true,
}: LoadingProps) => (
  <div
    className={cn(
      "relative inline-flex h-full min-h-[1em] w-full min-w-[48px] items-center text-base",
      className,
    )}
  >
    <div className={`${visible ? "hidden" : "visible"} w-full`}>{children}</div>
    <span
      className={`visible absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 select-none content-center items-center justify-center bg-transparent ${visible ? "visible" : "hidden"}`}
    >
      <Dot />
      <Dot />
      <Dot />
    </span>
  </div>
);
