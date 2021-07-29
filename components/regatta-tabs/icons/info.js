import * as React from "react"

function InfoIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx={16} cy={16} r={15.3} />
        <path d="M17.5 14.3l.3 8.7-3.3.3-.3-8.8z" />
        <circle cx={16} cy={9.5} r={2.3} />
      </g>
    </svg>
  )
}

export default InfoIcon
