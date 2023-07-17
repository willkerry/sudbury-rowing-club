const Rower = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeLinejoin="round"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    {...props}
  >
    <title>Rower</title>
    <path d="M4 8h8l5 8-6.5-4.5L5 17m16 0H5m14 3H3" />
    <path strokeLinecap="butt" d="M7.5 11.5L4 8" />
    <circle cx={11} cy={4} r={1} />
  </svg>
);

export default Rower;
