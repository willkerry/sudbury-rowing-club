const BOAT_CLASS_SYMBOLS: Record<string, string> = {
  " ": "-",
  "/": "or",
  "+": "coxed",
  "×": "scull",
  "−": "coxless",
};

export const sanitizeBoatClass = (boatClass: string) =>
  boatClass
    .split("")
    .map((char) => BOAT_CLASS_SYMBOLS[char] || char)
    .join("")
    .concat("_only");
