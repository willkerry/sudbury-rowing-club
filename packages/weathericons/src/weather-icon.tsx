import type { SVGProps } from "react";
import {
  iconsBySymbol,
  type SymbolCode,
  symbolDescriptions,
} from "./generated/lookup";

const VARIANT_SUFFIX = /_(day|night|polartwilight)$/;

export const describeSymbol = (symbol: string): string | undefined =>
  symbolDescriptions[symbol.replace(VARIANT_SUFFIX, "")];

export type WeatherIconProps = {
  symbol: SymbolCode;
} & SVGProps<SVGSVGElement>;

export const WeatherIcon = ({ symbol, ...props }: WeatherIconProps) => {
  const Icon = iconsBySymbol[symbol];

  if (!Icon) return null;

  return <Icon aria-label={describeSymbol(symbol)} role="img" {...props} />;
};
