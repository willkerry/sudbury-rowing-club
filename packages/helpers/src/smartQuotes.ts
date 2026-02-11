/// <reference path="./smartypants.d.ts" />
import { smartypantsu } from "smartypants";

export function smartQuotes<T = string>(text: T): T {
  if (typeof text !== "string") return text;

  try {
    return smartypantsu(text) as T;
  } catch {
    // Graceful degradation: return original text if smartypants fails
    return text;
  }
}
