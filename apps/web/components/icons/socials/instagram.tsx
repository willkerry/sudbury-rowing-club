import type { JSX } from "react";

export const Instagram = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" {...props}>
    <title>Instagram</title>
    <g fill="none" stroke="currentColor" strokeWidth={2}>
      <rect width={14} height={14} x={2} y={2} rx={4} />
      <circle cx={9} cy={9} r={3} />
    </g>
    <circle cx={13} cy={5} r={1} fill="currentColor" />
  </svg>
);
