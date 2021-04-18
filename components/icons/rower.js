function Rower(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        strokeLinejoin="round"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <path d="M4 8h8l5 8-6.5-4.5L5 17m16 0H5m14 3H3" />
        <path strokeLinecap="butt" d="M7.5 11.5L4 8" />
        <circle cx={11} cy={4} r={1} />
      </g>
    </svg>
  );
}

export default Rower;
