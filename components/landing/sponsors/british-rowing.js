import parseWithOptions from "date-fns/fp/parseWithOptions";
import * as React from "react";

function BritishRowing(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 57" {...props}>
      <title>British Rowing</title>
      <g fill="#D8232E">
        <path d="M73.4 2c.6.8 1.8 2.1 1 2.9 0 .1-2.5 2.7-6.1 5-5.5 3.4-12 6.2-13.4 7.3L4 56.7s-.3 0-.5-.3c-.2-.2-.3-.7-.2-.7.5-.4 48.7-37.7 50.8-39.5 2-1.6 7-8 10.1-10.8 0 0 4-3.6 6.7-5C72-.3 73.4 2 73.4 2" />
        <path d="M1.7 2c-.5.9-1.7 2.2-1 3 .1.1 2.6 2.7 6.2 5 5.4 3.4 12 6.2 13.4 7.3l50.9 39.5s.3 0 .6-.3c.2-.2.2-.7.2-.7-.6-.4-48.7-37.7-50.8-39.5-2-1.6-7-8-10.2-10.8 0 0-3.9-3.6-6.6-5C3-.3 1.7 2 1.7 2" />
        <path d="M35.5 49.9h4v-40h-4z" />
        <path d="M10.3 31.9h54.3v-4H10.3z" />
      </g>
      <path
        fill="#03203C"
        d="M43.7 49.8H55l-11.4-9v9zm21-4.8v-9H53.4l11.4 9zm-33.5 4.8V41l-11.4 8.8h11.4zm29.9-31.1l-3.6 1.8-4 3.1h11.3v-6.8L61 18.7zm-37.5-5.8l7.6 6v-9H20.8c1.1 1.4 2.3 2.6 2.8 3zM10.4 36.1v8.7l11.2-8.7H10.4zM54.2 10H43.7v9l7.7-6a36 36 0 002.8-3zM17.4 20.6c-.4-.4-2.1-1.2-3.5-2-1-.4-2.3-1-3.5-1.7v6.7h11l-4-3z"
      />
    </svg>
  );
}

export default BritishRowing;
