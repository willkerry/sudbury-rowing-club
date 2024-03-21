export const clampString = (input: string, length: number): string =>
  input.length > length ? `${input.slice(0, length - 1)}…` : input;
