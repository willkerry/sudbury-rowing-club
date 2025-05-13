import type { JSX } from "react";

export const Apple = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    {...props}
  >
    <title>Apple</title>
    <path d="M21.2 8.2c-.2 0-2.6 1.5-2.6 4.6 0 3.5 3.1 4.8 3.2 4.8 0 0-.5 1.7-1.7 3.4-1 1.5-2 3-3.7 3-1.6 0-2-1-4-1-1.8 0-2.4 1-4 1C7 24 6 22.6 4.9 21c-1.4-2-2.5-5-2.5-8 0-4.7 3-7.1 6-7.1 1.6 0 2.9 1 3.9 1s2.4-1.1 4.2-1.1c.7 0 3.1 0 4.8 2.4Zm-5.7-4.4c.8-.9 1.3-2 1.3-3.3V0c-1.2 0-2.7.8-3.6 1.8-.6.8-1.3 2-1.3 3.3v.4h.4c1 0 2.5-.7 3.2-1.7Z" />
  </svg>
);
