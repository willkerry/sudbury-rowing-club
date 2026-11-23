import { shuffle } from "radashi";
import { useMemo } from "react";

/**
 * Returns the given array, shuffled.
 * @param array - The array to shuffle.
 * @param isShuffled - Default is true.
 * @returns The shuffled array.
 */
export const useShuffledArray = <T>(array: T[], isShuffled = true): T[] =>
  useMemo(() => (isShuffled ? shuffle(array) : array), [array, isShuffled]);
