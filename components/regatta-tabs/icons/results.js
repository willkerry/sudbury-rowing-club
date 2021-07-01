import * as React from "react";

function ResultsIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        d="M16 31H6a1 1 0 01-1-1V9l7.2-8H27c.6 0 1 .4 1 1v15m-8.5 12v-6.5M22 29v-2.5m3 2.5v-9m3 9v-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

export default ResultsIcon;
