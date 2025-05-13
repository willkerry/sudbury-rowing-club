import type { JSX } from "react";

export const Google = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    {...props}
  >
    <title>Google</title>
    <path
      fill="#ea4335"
      d="M12 4.75a6.5 6.5 0 0 1 4.6 1.8l3.43-3.42A11.54 11.54 0 0 0 12 0 12 12 0 0 0 1.28 6.61l3.99 3.1A7.16 7.16 0 0 1 12 4.75Z"
    />
    <path
      fill="#4285f4"
      d="M23.49 12.28c0-.79-.07-1.55-.19-2.28H12v4.51h6.47a5.58 5.58 0 0 1-2.39 3.59l3.87 3c2.25-2.09 3.54-5.18 3.54-8.83Z"
    />
    <path
      fill="#fbbc05"
      d="M5.26 14.3a7.29 7.29 0 0 1 0-4.6L1.28 6.62a11.96 11.96 0 0 0 0 10.78l3.98-3.1Z"
    />
    <path
      fill="#34a853"
      d="M12 24a11.5 11.5 0 0 0 7.95-2.9l-3.87-3A7.22 7.22 0 0 1 12 19.24a7.17 7.17 0 0 1-6.74-4.96l-3.98 3.1A12 12 0 0 0 12 24Z"
    />
    <path fill="none" d="M0 0h24v24H0Z" />
  </svg>
);
