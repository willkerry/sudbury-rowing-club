export type Icon = JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>;

export const defaultProps: Icon = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 32",
  fill: "none",
  strokeLinejoin: "round",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
};
