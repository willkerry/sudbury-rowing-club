"use client";

import { motion, useTransform } from "motion/react";
import { useMemo } from "react";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { cn } from "@/lib/utils";
import styles from "./lcd-screen.module.css";

const getTotalSeconds = (time: { minutes: number; seconds: number }) =>
  time.minutes * 60 + time.seconds;

export const LCDScreen = ({
  time,
}: {
  time: { minutes: number; seconds: number };
}) => {
  const targetSeconds = useMemo(() => getTotalSeconds(time), [time]);

  const animatedSeconds = useAnimatedNumber(targetSeconds);
  const minutesText = useTransform(animatedSeconds, (v) =>
    Math.floor(v / 60)
      .toString()
      .padStart(2, " "),
  );
  const secondsText = useTransform(animatedSeconds, (v) =>
    Math.floor(v % 60)
      .toString()
      .padStart(2, "0"),
  );

  return (
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
          "whitespace-pre",
          "relative z-20 font-base font-digital font-light text-9xl text-green-400 leading-none",
          "before:pointer-events-none before:absolute before:inset-0 before:z-[-1] before:text-green-400 before:opacity-10 before:content-['88:88']",
        )}
      >
        <motion.span>{minutesText}</motion.span>
        <span className="animate-pulse">:</span>
        <motion.span>{secondsText}</motion.span>
      </div>
    </div>
  );
};
