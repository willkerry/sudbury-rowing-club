import type { JSX } from "react";

export const Instagram = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Instagram</title>
    <g fill="none" stroke="currentColor" strokeWidth={2}>
      <rect height={14} rx={4} width={14} x={2} y={2} />
      <circle cx={9} cy={9} r={3} />
    </g>
    <circle cx={13} cy={5} fill="currentColor" r={1} />
  </svg>
);
