const BOAT_CLASS_SYMBOLS: Record<string, string> = {
  "×": "scull",
  "+": "coxed",
  "−": "coxless",
  "/": "or",
  " ": "-",
};

export const sanitizeBoatClass = (boatClass: string) =>
  boatClass
    .split("")
    .map((char) => BOAT_CLASS_SYMBOLS[char] || char)
    .join("")
    .concat("_only");
