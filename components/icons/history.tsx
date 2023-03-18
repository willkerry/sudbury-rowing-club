const History = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    fillRule="evenodd"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    {...props}
  >
    <title>History</title>
    <path d="M10 7V5h10v12c0 .7-.2 1.2-.5 1.5-.3.3-.8.5-1.5.5H9c-.7 0-1.2-.2-1.5-.5-.3-.3-.5-.8-.5-1.5v-1h9v1c0 .7.2 1.2.5 1.5.3.3.8.5 1.5.5" />
    <path d="M16 13l-6-6a6 6 0 00-3.5-1A6 6 0 003 7l2 2m2 0v2c.3.3 1.2.5 2.5.5s2.3-.7 3-2m-2.5 2V16M5 9h2" />
  </svg>
);

export default History;
