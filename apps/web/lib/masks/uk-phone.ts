import type { MaskitoOptions } from "@maskito/core";
import { maskitoUpdateElement } from "@maskito/core";
import {
  maskitoEventHandler,
  maskitoPrefixPostprocessorGenerator,
  maskitoWithPlaceholder,
} from "@maskito/kit";

/**
 * It is better to use en quad for placeholder characters
 * instead of simple space.
 * @see https://symbl.cc/en/2000
 */
const PLACEHOLDER = "";
const {
  /**
   * Use this utility to remove placeholder characters
   * ___
   * @example
   * inputRef.addEventListener('blur', () => {
   *     // removePlaceholder('+1 (212) 555-____') => '+1 (212) 555'
   *     const cleanValue = removePlaceholder(this.value);
   *
   *     inputRef.value = cleanValue === '+1' ? '' : cleanValue;
   * });
   */
  removePlaceholder,
  plugins,
  ...placeholderOptions
} = maskitoWithPlaceholder(PLACEHOLDER);

export const ukPhoneMask = {
  preprocessors: placeholderOptions.preprocessors,
  postprocessors: [
    maskitoPrefixPostprocessorGenerator(""),
    ...placeholderOptions.postprocessors,
  ],
  mask: [
    "+",
    "4",
    "4",
    " ",
    "(",
    "0",
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  plugins: [
    ...plugins,
    maskitoEventHandler("focus", (element) => {
      const initialValue = element.value || "";

      maskitoUpdateElement(
        element,
        initialValue + PLACEHOLDER.slice(initialValue.length),
      );
    }),
    maskitoEventHandler("blur", (element) => {
      const cleanValue = removePlaceholder(element.value);

      maskitoUpdateElement(element, cleanValue === "" ? "" : cleanValue);
    }),
  ],
} as MaskitoOptions;
