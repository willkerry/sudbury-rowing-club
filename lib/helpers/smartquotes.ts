/**
 * Converts straight quotes to curly quotes in a fairly naïve way.
 */
const smartQuotes = (text: string): string => {
  const output = text
    // Replace double quotes first.
    .replace(/"([^"]*)"/g, "&ldquo;$1&rdquo;")
    // Replace single quotes.
    .replace(/'([^']*)'/g, "&lsquo;$1&rsquo;")
    // Fix apostrophes.
    .replace(/([^\s])'/g, "$1&rsquo;");
  return output;
};
export default smartQuotes;
