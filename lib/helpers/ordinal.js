function indicator(i) {
  const j = Math.abs(i);
  const cent = j % 100;
  if (cent >= 10 && cent <= 20) return "th";
  const dec = j % 10;
  if (dec === 1) return "st";
  if (dec === 2) return "nd";
  if (dec === 3) return "rd";
  return "th";
}

export default function ordinal(i) {
  if (typeof i !== "number")
    throw new TypeError(`Expected number, got ${typeof i} ${i}`);

  if (!Number.isFinite(i)) return i;
  return i + indicator(i);
}
