"use client";

import { cn } from "@/lib/utils";

const BOAT_CLASS_SYMBOLS: Record<string, string> = {
  "×": "scull",
  "+": "coxed",
  "−": "coxless",
  "/": "or",
  " ": "-",
};

const sanitizeBoatClass = (boatClass: string) =>
  boatClass
    .split("")
    .map((char) => BOAT_CLASS_SYMBOLS[char] || char)
    .join("")
    .concat("_only");

const getElementsByBoatName = (boatName: string) =>
  document.querySelectorAll(`[data-boatid^="${boatName}"]`);

const highlightBoat = (boatName: string) => {
  const boatElements = getElementsByBoatName(boatName);

  boatElements.forEach((boatElement) => {
    boatElement.classList.add("ring-2");
  });
};

const unhighlightBoat = (boatName: string) => {
  const boatElements = getElementsByBoatName(boatName);

  boatElements.forEach((boatElement) => {
    boatElement.classList.remove("ring-2");
  });
};

export const Chip = ({
  children,
  color,
  id,
  className,
}: {
  children: React.ReactNode;
  location: "table" | "list";
  color: string;
  id: string;
  className?: string;
}) => {
  const sanitisedId = sanitizeBoatClass(id);

  return (
    <button
      data-boatid={sanitisedId}
      type="button"
      className={cn(
        "rounded px-0.5 font-medium ring-black ring-offset-1 transition",
        color,
        className,
      )}
      onMouseEnter={() => highlightBoat(sanitisedId)}
      onMouseLeave={() => unhighlightBoat(sanitisedId)}
      onFocus={() => highlightBoat(sanitisedId)}
      onBlur={() => unhighlightBoat(sanitisedId)}
      onClick={() => highlightBoat(sanitisedId)}
    >
      {children}
    </button>
  );
};
