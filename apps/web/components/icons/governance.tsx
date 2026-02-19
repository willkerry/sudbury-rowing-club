import type { JSX } from "react";

export const Governance = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    fill="none"
    fillRule="evenodd"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Governance</title>
    <path d="M20 16.5V20c0 .5-.5 1-1 1H5a1 1 0 01-1-1v-3.5M5 18h14m-7-4L7 9l6-6 5 5zm3.5 1l1.5-1.5 3 3M8.5 15L7 13.5l-3 3" />
  </svg>
);
