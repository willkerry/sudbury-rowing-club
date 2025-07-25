import { cn } from "@/lib/utils";
import styles from "./lcd-screen.module.css";

export const LCDScreen = ({
  time,
}: {
  time: { minutes: number; seconds: number };
}) => (
  <div
    aria-hidden
    className={cn(
      styles.lcdScreen,
      "relative z-10 overflow-hidden rounded-xl bg-gray-900 px-4 py-0.5 shadow-lg",
      "before:pointer-events-none before:absolute before:inset-0",
    )}
  >
    <div
      className={cn(
        styles.lcdText,
        "relative z-20 font-base font-light text-9xl text-green-400 leading-none",
        "before:pointer-events-none before:absolute before:inset-0 before:z-[-1] before:text-green-400 before:opacity-10 before:content-['88:88']",
      )}
    >
      {time.minutes.toString().padStart(2, "0")}
      <span className="animate-pulse">:</span>
      {time.seconds.toString().padStart(2, "0")}
    </div>
  </div>
);
