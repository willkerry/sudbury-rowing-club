import { defaultProps, type Icon } from "./defaultProps";

export const ContactIcon = (props: Icon) => (
  <svg {...defaultProps} {...props}>
    <title>Contact</title>
    <rect height={22.5} rx={4} width={30.5} x={0.8} y={4.8} />
    <path d="M28 9.5L19.5 18a5 5 0 01-7 0L4 9.5M5 24l6.5-6.5M27 24l-6.5-6.5" />
  </svg>
);
