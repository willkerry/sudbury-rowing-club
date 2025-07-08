import type { JSX } from "react";

export const MyClubhouse = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <title>My Clubhouse</title>
    <path
      d="M2 9.5c5.5-2 9.4-4.1 11-6.5 1.6 2.4 4.8 4.6 10 7M4.5 8.5v11M20.5 9v11M1 21c.7-1 2-1.5 3.5-1.5 2.4 0 18 1 18.5 1m-13.5-1V12H15v8"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);
