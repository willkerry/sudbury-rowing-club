import type { JSX } from "react";

const EnvironmentAgency = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    {...props}
  >
    <title>Environment Agency</title>
    <path
      fill="currentColor"
      d="M12.2 17.5c1 1.9 2.1 4 3 6.1a14 14 0 01-6.1.1l.7-1.4 2.4-4.8zM12 0c13 .1 16.6 18 4.7 23.1a76 76 0 00-2.7-6.6V14a11.4 11.4 0 005-3l-1-1.5c-3.6 3.3-8 3.4-11.5 0l-1 1.5a10.8 10.8 0 005 3v2.5c-1 2.2-2.1 4.4-2.9 6.7C-4.5 18.4-1.2.1 12 0zm-.8 2.5a2.7 2.7 0 00-2 .9 2.9 2.9 0 00-4.4 2.7 2.9 2.9 0 00-2.1 4.2c-3.6 3.2 2.2 8.5 4.7 4a2.6 2.6 0 11-3.5-3.8 2.1 2.1 0 013.6-2.3 2.2 2.2 0 00-1.6-2 1.9 1.9 0 013.4-1.3 3 3 0 014.6-.1 2.8 2.8 0 00-2.7-2.3zm8.2 3.2c-.8-1.5-2.7-1.7-4.2-.7a2.6 2.6 0 013.2 3.3 3.2 3.2 0 012.7 4.2 3 3 0 00-1.3-5.2 2.9 2.9 0 00-.4-1.6zM11.6 7c-2.7.6-1.6 4.8 1 3.9-1.7.2-1.8-2.5-.1-2.5a1.3 1.3 0 011.2 1.7A2.1 2.1 0 0011.6 7z"
    />
  </svg>
);

export default EnvironmentAgency;
