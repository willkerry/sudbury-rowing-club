const Events = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    fillRule="evenodd"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <title>Events</title>
    <path d="M8 4h8v7.2a4 4 0 01-8-.2h0V4zM7 20h10m-5 0v-5" />
    <path d="M8 6H5c-.7 0-1 .3-1 1 0 2 1 5 4 5m8-6h3c.7 0 1 .3 1 1 0 2-1 5-4 5" />
  </svg>
);

export default Events;
