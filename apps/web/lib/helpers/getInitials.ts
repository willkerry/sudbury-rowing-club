import { trim } from "radash";

const LETTER_PATTERN = /^[a-z\u00C0-\u017F]/i;

export const getInitials = (name?: string): string => {
  if (!name) return "";

  const trimmed = trim(name);
  if (!trimmed) return "";

  const words = trimmed.replace("-", " ").split(" ");

  return words
    .map((word) => LETTER_PATTERN.exec(word)?.[0])
    .filter(Boolean)
    .join("")
    .toUpperCase();
};
