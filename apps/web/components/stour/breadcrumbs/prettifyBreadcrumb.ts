const PRETTIFY_PAIRS: [RegExp, string][] = [
  [/stourtoys/g, "StourToys"],
  [/oe/g, "ö"],
  [/ae/g, "ä"],
  [/ue/g, "ü"],
];

export const prettifyBreadcrumb = (string: string) => {
  const prettified = PRETTIFY_PAIRS.reduce(
    (acc, [regex, replacement]) => acc.replace(regex, replacement),
    string,
  );

  return prettified.charAt(0).toUpperCase() + prettified.slice(1);
};
