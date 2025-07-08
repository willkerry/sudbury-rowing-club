import { type Icon, defaultProps } from "./defaultProps";

export const EventsIcon = (props: Icon) => (
  <svg {...defaultProps} {...props}>
    <title>Events</title>
    <circle cx={16} cy={11.5} r={3.8} />
    <circle cx={16} cy={11.5} r={7.5} />
    <path d="M9 15L1 26l8-3 5 6 2-10m7-4l8 11-8-2-5 5-2-10" />
  </svg>
);
