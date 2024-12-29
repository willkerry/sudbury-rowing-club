// @ts-expect-error
import { smartypantsu } from "smartypants";

export function smartQuotes<T = string>(text: T): T {
  if (typeof text !== "string") return text;

  try {
    return smartypantsu(text);
  } catch (_error) {
    return text;
  }
}
