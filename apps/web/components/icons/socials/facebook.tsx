import type { JSX } from "react";

export const Facebook = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" {...props}>
    <title>Facebook</title>
    <path
      fill="currentColor"
      d="M17 9a8 8 0 10-9 7v-5H6V9h2V7a3 3 0 012-2h2v2h-1a1 1 0 00-1 1v1h2v2h-2v5a7 7 0 007-7z"
    />
  </svg>
);
