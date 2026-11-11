import { animate } from "motion";
import { useMotionValue } from "motion/react";
import { useEffect } from "react";

/**
 * Duration scales logarithmically with the delta:
 *   - delta 1 → 0.2s
 *   - delta 10 → 0.4s
 *   - delta 100 → 0.6s
 *   - delta 10,000 → 1.0s
 *   - delta 10,000,000 → 1.6s
 *
 * Formula: 0.2 * log10(delta + 1), clamped to [0.15, 2]
 */
const getDuration = (from: number, to: number) =>
  Math.max(0.15, Math.min(2, 0.2 * Math.log10(Math.abs(to - from) + 1)));

export function useAnimatedNumber(
  target: number,
  aggressiveness = 0.7,
  shelfWidth = 0.2,
) {
  const value = useMotionValue(0);

  useEffect(() => {
    const duration = getDuration(value.get(), target);

    const controls = animate(value, target, {
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
    });

    return () => controls.cancel();
  }, [target, aggressiveness, shelfWidth, value]);

  return value;
}
