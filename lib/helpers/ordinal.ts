/**
 * Returns the appropriate ordinal suffix for the given number.
 */
const indicator = (i: number): "st" | "nd" | "rd" | "th" => {
  const j = Math.abs(i);

  const cent = j % 100;
  if (cent >= 10 && cent <= 20) return "th";

  const dec = j % 10;
  if (dec === 1) return "st";
  if (dec === 2) return "nd";
  if (dec === 3) return "rd";

  return "th";
};

/**
 * Returns the given number with an appropriate ordinal suffix. e.g. 1 &rarr; 1st, 2 &rarr; 2nd
 */
const ordinal = (i: number): string => {
  if (typeof i !== "number")
    throw new TypeError(`Expected number, got ${typeof i} ${i}`);
  if (!Number.isFinite(i)) return i.toString();

  return i + indicator(i);
};

export default ordinal;
