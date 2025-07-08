import { type Icon, defaultProps } from "./defaultProps";

export const InfoIcon = (props: Icon) => (
  <svg {...defaultProps} {...props}>
    <title>Info</title>
    <circle cx={16} cy={16} r={15.3} />
    <path d="M17.5 14.3l.3 8.7-3.3.3-.3-8.8z" />
    <circle cx={16} cy={9.5} r={2.3} />
  </svg>
);
