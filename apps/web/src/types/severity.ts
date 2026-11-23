export const severities = ["red", "amber", "green", "neutral"] as const;

export type Severity = (typeof severities)[number];
