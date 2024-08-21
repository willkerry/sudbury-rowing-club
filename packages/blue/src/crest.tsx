import { SVGProps } from "react";

/**
 * Renders the club crest in inlined SVG. Not terribly efficient, so don't use
 * profligately.
 */
export const Crest = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 800 1000"
    {...props}
  >
    <title>Club Crest</title>
    <path d="M596 590c-1 101 18 174-91 221-39 21-83 40-103 81-24-41-72-62-112-85-105-45-83-123-85-217h391zm-219 40c-12-19-28 9-42 11-7 9 10 11 16 10l-9 1c-7-1-13 8-6 4 2-3 7-3 10-2l-9 2c11 2 16 1 18 3 0 9-18 35-3 49 0 20-2 59-27 58-14 5 13 13 18 6 12-15 17-66 37-35-14 27 15 36 35 37-6 2-62 5-42 14 15 1 56-2 62-16 0-10 32-9 42-33 15-20 6-58-22-47 56-7 4 114-44 26l-20-36c-13-18-9-29-13-49l-1-3z" />
    <path d="M193 636c3 30-41 49-16 76l7 26c8 20-10 18-21 18-2 10-15 2-15 1v-6c-19 11-1-26-10-35 1-23 49-42 21-48-3-2-5-6-4-10 2-17 17-13 24-8 4-4-1-14 7-11 3 0 4-1 7-3zm427-4c-14 23 10 3 18 21 3 8-6 13-13 16-7 2 34 26 38 32 3 6 6 42 0 46-7 5-9 2-15 3-5 1-9 4-10-1-17-20-17 26-19-29-2-11 0-24 11-28-14-14-48-53-10-60zM403 276c101 25 4 160-57 78 15-2 31-4 45-11 32 4 28-40-3-34-5-2-30-10-34-14 13-13 28-22 49-19z" />
    <path d="M354 301v1l34 12c25-6 27 28 1 23-12 6-26 9-40 11-3 0-7 2-10 0-7-4-2-16 5-16-2-6-2-12 0-17-22-1-3-28 10-14zm-5 16c-1 4-2 9 0 13 0 1 1 2 3 2l28-4c3 0 3-5 0-5l-28-8-3 2zm141-150c42-2 4 54-22 45-13 13-21 29-31 44-41-28 16-125 53-89zm-324 23C160 101 113 67 61 0L0 46c44 65 67 127 145 158l21-14zM800 46L739 0c-47 59-103 111-105 190l21 14c70-25 105-97 145-158zM632 196l17 13-33 45c-11 0-22 5-33 9l49-67zm-411 72l-53-72-17 13 40 55 30 4zm140-18c8-37-8-71-44-87-6-2-12-2-19 5-29-2-22 54 16 47 13 11 24 25 31 41 5-4 11-4 16-6zM145 905l-23-17-60 87c-14 21-2 37 19 13 22-27 44-54 64-83zm80-110l-23-16-76 104 23 16 76-104zm429 110l6 7 19 26 40 50c20 23 33 9 20-12-20-30-40-59-62-88l-23 17zm19-22l-76-104-22 16 75 104 23-16zM218 275c-6 12-3 26 5 35-3 3-19 20-23 17-5-4-3-13-3-18l-16 10c-4 1-8 4-11 8h-2c-4-5-6-18-3-23l-5-4c-5 8-6 15-8 21-2 7-6 12-12 16-2 6 0 14-2 20-6-1-12-7-16-10 1 7 6 33-2 33-6 1-12-9-15-12 1 7 3 16 0 24 0 3-2 4-4 5l-19 13c-18-48-4-86 24-111 29-24 72-34 112-24zm-8 173c-8 9-23 19-36 13-4-7-13-18-22-11-4 4-8 11-14 12-4 0-9-1-18-8 0-5 2-12 7-13 10-3 22 7 34 4 11-4 11-12 18-19l5 5c4-5 8-11 7-18-2-8-9-9-14-14 4-5 6-9 7-15-4 2-8 5-12 5-3 0-4-4-6-5-3-4-6-4-9-6 4-5 15-7 21-7 9-1 19 0 27 5 24 15 21 53 5 72z" />
    <path d="M109 618c2-4 8-4 9-10 3-10-9-18-7-28l2-9c-6 5-22 20-31 14l2-5c6-19 5-38 11-57-13-21-23-45-21-70 2-18 11-32 22-40 12-8 26-10 38-7s23 12 28 27c-7 3-16 3-23 0-11-4-19-2-24 3s-6 13-5 20c2 19 19 26 35 17 6-3 9-9 14-13 9 6 8 17 7 27 10-10 18-12 31-14v149c-3 4-7 7-12 10-6-5-11-16-12-23l-6-2c-2 8-4 16-11 22 2-15-8-18-13-30l-6 2c0 10-20 17-28 17zm596-109c-2 4-6 7-4 11 12 16 7 36 15 53-5 9-24 1-28-5l-5 2c1 8-2 15-4 22-3 8 0 17-1 24-7-6-10-16-15-23l-5-6c-1 12-5 25-14 33-3 3-5 4-7-1l-1-19c-8 12-17 23-31 28l-1-158c8-1 17 2 24 6 2-4 3-14 8-15 11 17 30 14 41-1 4-7 7-15 5-21-2-10-12-12-21-12-8 4-20 8-29 3-1 0-2-1-1-3 12-21 37-30 60-24 39 20 41 76 14 106zm-274-97c22-7 41 18 46 37l1 3c-6-4-12-9-19-12-15-5-29 8-43 12-9 3-17 1-23-6l-5-4c-1 7-2 14-8 19s-20 3-26-1c-5-3-6-9-7-14l-4 4c-3 3-17 5-19 0-6-12 19-42 31-37 6 3 6 11 7 16 20-19 44-11 69-17z" />
    <path d="M576 374c12-15 38-23 56-14 5 3 10 7 14 14 2 3-1 3-4 5-7 4-16 10-24 9l-4-1c1 4 1 7-1 10-5 6-12 8-14 15-2 4-2 8 1 14l6-2c-1-4 7-9 8-3 2 11 10 18 20 21 9 2 21 0 31-5 4 1 6 7 6 11-7 4-15 7-24 8-3-3-6-8-12-8-5 0-8 5-11 9-33-2-53-26-56-50-2-11 1-23 8-33zm119 18c3-10 3-19 1-29-5 5-9 10-16 11-4 1-3 0-2-3h1c8-16 1-35-1-53-4 10-8 20-19 24-1 1-1-7-1-8 0-10 0-28-12-42l-5 2c3 13-1 21-11 28h-1c-10-7-13-19-23-27 1 8 5 24-7 27-4 1-9-5-13-7l-6-11c7-10 8-22 3-33 39-18 83-8 112 19 28 27 41 69 18 114-5-5-12-9-18-12zM267 269c9 11 17 21 29 26 2-11 12-30 26-25-4 6-10 9-9 17 2 12 11 21 17 30 3 4 4 8 4 11-10 8-7 20 0 29l22 20c-4 8-3 16-6 25-16 0-22 21-38 18-5-1-7 2-11 2-1 0-2-1-2-3-2-9 1-17 6-25-11-2-22-2-33-2-1-9 5-18 13-24l-3-5c-5 2-19 0-22-2v-4c-5 1-14 4-18 0-1-1 1-5 1-6l8-17-26 8c-4-4-5-9-3-14 3-5 8-10 15-12l6-1-5-4c-6-6-11-13-13-22 0-7 8-19 16-22 1 11-1 19 8 28l5-3c-2-5 2-11 4-15 2-3 6-9 9-8zm292-8c6 2 12 9 15 18 3 12-4 20-13 26 13 8 18 20 14 35-4 8-32-10-36-13l6 15c1 2 1 2-1 3-9 5-20 9-31 10l5 4c6 6 5 16 9 23l1 2c-13 2-26 1-37-4 6 12 5 24-2 36l-2 1c-8-2-17-15-23-20v11h-2c-9-2-16-9-26-9-5-7-8-14-6-24v-1c21-14 30-43 22-67 18-5 26-24 19-40 13-6 15 14 25 11 11-2 20-13 24-23 12 8 18 19 19 34 7-9 12-20 20-28z" />
    <path d="M486 429c13-6 20-19 21-33 9-1 23 3 31-4 8-9-6-22-5-31 8-4 19-3 24-12 17 7 32 1 31-18a20 20 0 0027-7l8 9c9 6 18-4 24-10 1 9-1 22 5 29 5 6 14 0 19-3 1 6 0 12-2 18-2 3-3 7-2 10s3 6 5 7c4 2 9 2 14 1l-2 5c-26-3-45 9-59 27-1-4-3-7-7-9 3-2 6-5 8-9 10-3 20-8 28-13 5-3 6-8 4-14-13-29-57-33-81-13a55 55 0 00-14 70c-24 0-48 2-72 1l-5-1zm-197-26v20l4 7h-60c8-31-13-69-47-70-12 0-26 1-35 9-7 6-8 16 1 20a31 31 0 005 2c4 3 5 7 9 9-1 9 9 10 13 15-4 0-8 3-10 6a53 53 0 00-51-27l-1-2 7 1c10-3 11-18 11-26 7 2 14 1 15-8v-16l10-9c1 3 3 5 5 5 9 4 16-8 23-11 2 4 3 9 7 11 5 3 11-1 16-4 0 5 1 11 4 15 4 4 10 4 16 2v4c0 4 1 6 4 9 4 3 10 5 17 4 3 4 9 4 13 4-3 7-8 24 0 30 8 4 17-1 24 0z" />
    <path
      fillRule="evenodd"
      d="M316 438c-6 21 8 25 26 21 11 17 43 19 51-2 12 9 25 4 37-2 10-4 20-9 30-6 3 0 5 3 8 6 4 4 8 9 13 7 9-4 4-16 1-24h89c7 9 15 16 25 21v122H205V464c10-7 17-16 22-26h89zm210 58c0-11 6-19 10-22a30 30 0 019 22c24-9 16 27 6 21 2-16-14-4-11 16 5 1 4 1 3 3-2 1-6 5 3 13h-6l-4 2-1 1c-2-3-4-3-6-3h-4c8-6 5-11 4-13s-1-3 1-3c3 0 2-2 2-4v-1c0-15-15-27-12-12-11 7-16-29 6-20zm-270 4c0-11 6-19 10-22a30 30 0 0110 22c23-9 16 27 5 20 3-15-14-3-11 17 6 1 5 1 3 2-2 2-5 6 4 14h-7l-3 1-1 1c-3-3-4-2-6-2h-5c9-7 6-11 5-14-1-1-2-2 0-2 3 0 3-3 3-4v-1c0-15-15-27-12-12-12 6-17-30 5-20zm172 32l-1 8c-24 3 1 12 11 7 5-24 13-23 32-12-5 2-10 4-13 10 17 4 37-17 15-20-4-4-6-7-9-13l-3-7-1-2 1-1 4-3c16-16-12-22-25-15l-3 1c-10 5-35 15-29-2 3-32-34 42 25 8 34-18 39 6 13 8-7 0-15 2-22 4-18 4-35 8-41-17 5-7-41-8-30 8 14 0-9 7-12-4 1 12 9 10 16 8-1 2-2 3-4 1 0 8 3 6 7 5l2-1c4 12-8 9-19 5-9-2-17-5-16 1 45 25 35 26 21 28-7 1-16 1-17 7 47 6 61 4 100-23l-2 11z"
    />
    <path d="M428 402c-9-6-7-15-7-24a60 60 0 01-56 3c-6 8-3 16-7 25 4 2 7 5 9 8 9-12 70-7 61-12zM213 760c-8-5-16 7-8 12l27 20c7 5 15-7 8-12l-27-20zm382 12c8-6-1-17-8-12l-26 19c-8 6 0 18 8 13l26-20zM420 189c11-24-9-58-36-47-4 6-13 3-19 8-10 9-1 18 11 15-4 5-14 0-19 1s-7-3-9-5c-5 0-2 5 1 7 3 3 8 2 11 2 9-2 5 10 13 9 39-5-6 10-4 40l-3 34c-8 5-30 6-10 16 21 11 30-20 71 6 7-3 14-12 6-16-19-16-20-47-13-70z" />
  </svg>
);
