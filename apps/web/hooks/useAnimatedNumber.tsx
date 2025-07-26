import { animate } from "motion/react";
import { useEffect, useState } from "react";

export function useAnimatedNumber(
  target: number,
  duration = 1,
  aggressiveness = 0.7,
  shelfWidth = 0.2,
) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: (t: number) => {
        const shelfProgress = (1 - aggressiveness) * 0.5;

        if (t < shelfWidth) {
          return (t / shelfWidth) * shelfProgress;
        }
        if (t > 1 - shelfWidth) {
          const shelfT = (t - (1 - shelfWidth)) / shelfWidth;
          return shelfProgress + aggressiveness + shelfProgress * shelfT;
        }

        return (
          shelfProgress +
          aggressiveness * ((t - shelfWidth) / (1 - 2 * shelfWidth))
        );
      },
      onUpdate: (progress) => {
        setCurrent(Math.floor(progress));
      },
    });

    return controls.stop;
  }, [target, duration, aggressiveness, shelfWidth]);

  return current;
}
