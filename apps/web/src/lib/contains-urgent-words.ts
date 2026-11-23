const URGENT_WORDS = ["emergency", "urgent", "critical"];

export const containsUrgentWords = (title: string) =>
  URGENT_WORDS.some((word) => title.toLowerCase().includes(word));
