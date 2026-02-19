import type { JSX } from "react";

export const UserDropdown = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    fill="none"
    height={24}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width={24}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>User Dropdown</title>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8" />
    <circle cx="5" cy="19" r=".4" />
    <circle cx="9" cy="19" r=".4" />
    <circle cx="13" cy="19" r=".4" />
  </svg>
);
