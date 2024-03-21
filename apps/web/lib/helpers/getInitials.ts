import { trim } from "radash";

const LETTER_PATTERN = /^[a-z\u00C0-\u017F]/i;

export const getInitials = (name?: string): string => {
  if (!name) return "";

  const trimmed = trim(name);
  if (!trimmed) return "";

  const words = trimmed.split(" ");

  return words
    .map((word) => word.match(LETTER_PATTERN)?.[0])
    .filter(Boolean)
    .join("")
    .toUpperCase();
};
