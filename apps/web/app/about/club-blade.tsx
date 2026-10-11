import type { SVGProps } from "react";

export const ClubBlade = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 10 465 196" xmlns="http://www.w3.org/2000/svg" {...props}>
    <linearGradient
      gradientUnits="userSpaceOnUse"
      id="club-blade-shaft"
      x1="111.34"
      x2="106.96"
      y1="44.97"
      y2="72.63"
    >
      <stop offset="0" />
      <stop offset=".25" stopColor="#d3d3d3" />
      <stop offset=".6" />
    </linearGradient>
    <path
      d="m-86.2 13.68 197.54 31.29-4.38 27.66-197.54-31.3Z"
      fill="url(#club-blade-shaft)"
    />
    <clipPath id="club-blade-spoon">
      <path d="M105 75c0 1 1 2 2 2 32 12 63 72 70 104 54 18 212 20 278 20 3 0 6-3 6-6L450 27c0-3-3-6-6-6L113 43c-1 0-2 1-2 2Z" />
    </clipPath>
    <g clipPath="url(#club-blade-spoon)">
      <path d="M0 0h500v230H0Z" fill="#002147" />
      <clipPath id="club-blade-tip">
        <path d="M443.25 14h13.88L471 205h-17.08L357 111Z" />
      </clipPath>
      <path
        clipPath="url(#club-blade-tip)"
        d="M0 0h500v230H0Z"
        fill="#f2f2f2"
      />
    </g>
    <path
      d="M105 75c0 1 1 2 2 2 32 12 63 72 70 104 54 18 212 20 278 20 3 0 6-3 6-6L450 27c0-3-3-6-6-6L113 43c-1 0-2 1-2 2Z"
      fill="none"
      stroke="#002147"
      strokeWidth="4"
    />
  </svg>
);
