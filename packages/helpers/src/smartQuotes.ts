/**
 * Converts straight quotes to curly quotes in a fairly naïve way.
 */
export function smartQuotes<T = string>(text: T): T {
  if (typeof text !== "string") return text;

  return (
    text // Replace double quotes first.
      .replace(/"([^"]*)"/g, "\u201C$1\u201D")
      // Replace single quotes.
      .replace(/'([^']*)'/g, "\u2018$1\u2019")
      // Fix apostrophes.
      .replace(/([^\s])'/g, "$1\u2019") as T
  );
}
