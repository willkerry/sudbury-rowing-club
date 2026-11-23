const THRESHOLDS = [1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118] as const;

/**
 * Converts mph windspeeds to the Beaufort scale, clumsily.
 */
export const convertKphToBeaufort = (kph: number) => {
  if (Number.isNaN(kph)) throw new Error("kph is not a number");
  if (kph < 0) throw new Error("kph is negative");

  for (const threshold of THRESHOLDS) {
    if (kph < threshold) return THRESHOLDS.indexOf(threshold);
  }

  return THRESHOLDS.length;
};
