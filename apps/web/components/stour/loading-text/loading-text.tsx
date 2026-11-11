import { cn } from "@/lib/utils";
import styles from "./loading-text.module.css";

type LoadingTextProps = {
  text?: string;
  className?: string;
};

const Dot = () => <span className={styles.dot}>.</span>;

export const LoadingText = ({
  text = "Loading",
  className,
}: LoadingTextProps) => (
  <span className={cn("inline-flex items-baseline", className)}>
    {text}
    <span>
      <Dot />
      <Dot />
      <Dot />
    </span>
  </span>
);
