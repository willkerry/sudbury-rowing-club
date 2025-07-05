const ordinalRules = new Intl.PluralRules("en-GB", { type: "ordinal" });

const SUFFIXES = ["th", "st", "nd", "rd"] as const;

type Suffix = (typeof SUFFIXES)[number];

const SUFFIX_RULES: Record<Intl.LDMLPluralRule, Suffix> = {
  zero: SUFFIXES[0],
  one: SUFFIXES[1],
  two: SUFFIXES[2],
  few: SUFFIXES[3],
  many: SUFFIXES[0],
  other: SUFFIXES[0],
};

/**
 * Returns the given number with an appropriate ordinal suffix. e.g. 1 &rarr; 1st, 2 &rarr; 2nd
 */
export const ordinal = <N extends number>(i: N): `${N}${Suffix}` => {
  const suffix = SUFFIX_RULES[ordinalRules.select(i)];

  return `${i}${suffix}`;
};
