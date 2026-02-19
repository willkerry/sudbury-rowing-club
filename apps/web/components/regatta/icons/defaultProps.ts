import type { JSX } from "react";
export type Icon = JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>;

export const defaultProps: Icon = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.5,
  viewBox: "0 0 32 32",
  xmlns: "http://www.w3.org/2000/svg",
};
