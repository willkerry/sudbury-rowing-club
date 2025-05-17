/**
 * Clamp a string to a certain length, adding an ellipsis if it's longer than the specified length.
 */
export const clampString = (input: string, length: number): string =>
  input.length > length ? `${input.slice(0, length - 1)}…` : input;
