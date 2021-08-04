import * as React from "react"

function ContactIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
      >
        <rect width={30.5} height={22.5} x={0.8} y={4.8} rx={4} />
        <path d="M28 9.5L19.5 18a5 5 0 01-7 0L4 9.5M5 24l6.5-6.5M27 24l-6.5-6.5" />
      </g>
    </svg>
  )
}

export default ContactIcon
