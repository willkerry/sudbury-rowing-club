const ordinalRules = new Intl.PluralRules("en-GB", { type: "ordinal" });

const SUFFIXES = {
  TH: "th",
  ST: "st",
  ND: "nd",
  RD: "rd",
} as const;

const SUFFIX_RULES: Record<
  Intl.LDMLPluralRule,
  (typeof SUFFIXES)[keyof typeof SUFFIXES]
> = {
  zero: SUFFIXES.TH,
  one: SUFFIXES.ST,
  two: SUFFIXES.ND,
  few: SUFFIXES.RD,
  many: SUFFIXES.TH,
  other: SUFFIXES.TH,
};

const getSuffix = (i: number) => SUFFIX_RULES[ordinalRules.select(i)];

/**
 * Returns the given number with an appropriate ordinal suffix. e.g. 1 &rarr; 1st, 2 &rarr; 2nd
 */
const ordinal = (i: number): string => `${i}${getSuffix(i)}`;

export default ordinal;
