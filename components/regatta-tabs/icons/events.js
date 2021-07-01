import * as React from "react";

function EventsIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx={16} cy={11.5} r={3.8} />
        <circle cx={16} cy={11.5} r={7.5} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 15L1 26l8-3 5 6 2-10m7-4l8 11-8-2-5 5-2-10"
        />
      </g>
    </svg>
  );
}

export default EventsIcon;
