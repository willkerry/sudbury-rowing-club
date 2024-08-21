import type { SVGProps } from "react";

const CommitteeSignature = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={6}
    viewBox="0 0 1447 337"
    {...props}
  >
    <title>The Committee</title>
    <path d="M469 132c-74-106-175 22-151 112 35 157 183 61 237-27M77 26c-9 96-34 204 18 293m8-121c24-32 47-73 50-114-2-34-29-6-33 12-7 25-36 135-11 132 49-79 16 86 73-11m991 19c-63 113-100 126-98-20 11-167 89-176 5-13m189 49c-67 118-97 103-93-28 10-168 87-175 4-12M244 2C165 21 82 23 2 31m1365 219c5-5 17-12 22-6-8 15-30 0-36 19-17 50 63 43 92 41m-213-93c-18 7-37 14-56 13m-156-14c37 12 76 7 112-7" />
    <path d="M565 205c17 4 22 16 9 30-28 14-18-39 3-42" />
    <path d="M562 203c-41-47 26-38 19 8 14 2 29 1 43-4 5 26 5 46 21 10 30-63 29-10 62-5 41-31 42 36 80 34 62-65 26 29 88-9 13-4 18 15 24 23 28 44 76 4 104-16m271 0c11 1 17-11 15-20-14 10-26 31-16 50 21 27 57-3 79-11M189 204c6 0 15-10 16-19-50 19-16 106 75 24m726 4c-16 71 27 51 68 22" />
    <circle cx={1014.6} cy={168.5} r={1} />
  </svg>
);

export default CommitteeSignature;
