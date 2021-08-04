import * as React from "react";

function EntriesIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 33 32"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
      >
        <path d="M2.5 7.5h12m-12 4h8m-8 4h5M23.7 4.7L7.5 20.9a4.5 4.5 0 106.3 6.4L30.1 11m-15.6 2.8a4.5 4.5 0 006.4 6.4" />
        <path d="M28 8.9a3 3 0 00-4.3-4.2 4.5 4.5 0 106.4 6.3" />
      </g>
    </svg>
  );
}

EntriesIcon.displayName = 'Entries';

export default EntriesIcon;
