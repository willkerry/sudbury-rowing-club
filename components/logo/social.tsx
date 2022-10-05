import { SVGProps } from "react";

/**
 * Renders the square 'social' profile picture version of the crest in inlined SVG.
 * 
 * @deprecated This component is deprecated and will be removed in the next major version.
 */
const Social = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <path fill="#003B80" d="M0 0h512v512H0z" />
    <g fill="#fff">
      <path d="M315.4 283c-.2 30.3 5.4 52.2-27.5 66.4-11.6 6.1-24.7 12-30.9 24.3-7.1-12.4-21.6-18.7-33.8-25.7-31.4-13.3-25-36.8-25.4-65h117.6zm-65.9 12c-3.6-5.8-8.6 2.7-12.8 3.4-2.1 2.7 3.2 3.2 5 3l-2.7.2c-2.3-.3-4 2.4-2 1.2.8-.8 2.1-.8 3.2-.6l-2.8.6c3.4.7 4.9.3 5.3.9.1 2.6-5.4 10.6-.8 14.8 0 6-.7 17.6-8 17.2-4.4 1.5 4 4 5.2 1.8 3.9-4.4 5.1-19.6 11.2-10.4-4.2 8.2 4.5 10.8 10.5 11-1.7.8-18.4 1.5-12.6 4.3 4.7.2 17-.7 18.9-4.8 0-3 9.4-2.6 12.4-10 4.5-5.9 1.9-17.2-6.7-14.1 17-2 1.5 34.2-13.2 8l-6-10.9c-3.9-5.3-2.6-8.8-3.9-14.6l-.2-1z" />
      <path d="M194.1 296.9c1 8.9-12.3 14.7-4.9 22.6.8 2.6 1.3 5.5 2.1 8 2.6 5.8-3 5.2-6.3 5.4-.5 2.8-4.5.6-4.3.2v-1.8c-5.8 3.1-.6-7.8-3.3-10.4.6-7 14.8-12.6 6.4-14.4-1-.7-1.5-2-1.3-3 .9-5.3 5.1-3.9 7.4-2.6 1.2-1.2-.5-4.2 2-3.1 1 0 1.4-.5 2.2-1v.1zm128.6-1.3c-4.3 6.8 2.8 1 5.3 6.2 1 2.4-1.7 4-3.9 4.8-2.1.8 10.4 7.8 11.4 9.6 1 1.8 2 12.6 0 14-2 1.3-2.8.6-4.4.8-1.6.3-2.7 1.3-3.1-.4-5-6-5.2 7.8-5.7-8.6-.6-3.4 0-7.3 3.5-8.5-4.2-4-14.8-15.8-3-17.9h-.1zm-65.4-106.9c30.5 7.6 1.3 48-17.1 23.5 4.5-.7 9.2-1.2 13.4-3.2 9.7 1 8.5-12.2-.9-10.3-1.6-.7-9-3-10.3-4.2 4-4 8.5-6.6 14.9-5.8z" />
      <path d="M242.6 196.4l10.1 3.8c7.5-1.8 8.2 8.3.5 7-3.8 1.8-8 2.7-12 3-1 .3-2.2.7-3.2.2-2-1.3-.6-4.7 1.4-4.8-.5-1.7-.5-3.5.1-5.2-6.5-.3-1-8.3 3.1-4zM241 201a6.6 6.6 0 00.1 4c.1.3.5.5.8.5l8.5-1.2c1 .1 1-1.4.1-1.5l-8.4-2.4c-.4 0-1 .2-1 .6zm42.6-44.8c12.5-.8 1.2 16-6.6 13.3-4 3.9-6.4 8.7-9.3 13.2-12.4-8.4 4.7-37.5 16-26.5zm-97.6 6.7c-2-26.7-16.1-36.8-31.5-56.9L136 119.9c13.1 19.4 20.3 38.1 43.7 47.4l6.3-4.4zm190.8-43L358.3 106c-14 17.7-30.8 33.3-31.5 56.9l6.3 4.4c21.2-7.6 31.8-29 43.7-47.4zM326.2 165v-.1l5 3.7-9.7 13.6c-3.3.1-6.7 1.4-10 2.7l14.7-20zm-123.7 21.5L186.7 165l-5.2 3.7 12 16.7c3 0 6 .5 9 1.2zm42.3-5.5a22.5 22.5 0 00-13.3-26c-2-.8-3.7-.7-5.7 1.5-9-.8-6.7 16 4.6 14 4.2 3.3 7.4 7.5 9.6 12.2 1.2-1 3.2-1.1 4.8-1.6zm-65 196.4l-7-4.9a512.6 512.6 0 00-18.3 26.1c-4 6.2-.3 11 5.7 3.8 6.8-8 13.5-16.3 19.6-25zm23.9-32.8l-6.8-4.8c-8 11-15.8 21.4-22.9 31l7 5 22.7-31.2zM333 377.5l1.6 2.2 5.7 7.6c3.8 5 8.2 10.2 12.3 15.1 5.8 7 9.8 2.7 5.7-3.6-5.8-9-12-17.7-18.4-26.3l-7 5zm5.7-6.6l-23-31.1-6.6 4.8 22.7 31.2 6.9-5zm-137-182.3c-2 3.5-1 7.6 1.4 10.5-.9.7-5.7 6-7 5-1.3-1-.8-4-.9-5.5a15.7 15.7 0 01-4.7 3 7.2 7.2 0 00-3.4 2.6l-.5-.1c-1.3-1.4-1.7-5.4-1-7l-1.5-1c-1.5 2.2-1.8 4.4-2.3 6a8.4 8.4 0 01-3.6 5c-.5 1.7 0 4.2-.7 5.9-1.7-.2-3.5-2-4.8-3 .3 2 1.7 10-.7 10.1-1.6.1-3.4-2.7-4.3-3.8.2 2.3.7 5 0 7.2-.2.8-.6 1.3-1.2 1.7-2 1.4-4 2.2-5.8 3.8-5.5-14.3-1.3-26 7.3-33.2a38.7 38.7 0 0133.7-7.2zm-2.5 51.7c-2.4 2.9-6.8 6-10.7 4-1.4-2-4-5.5-6.7-3.2-1.4 1.2-2.3 3.2-4.3 3.4-1 .2-2.8-.3-5.5-2.4 0-1.4.8-3.4 2.3-3.8 2.8-.8 6.6 2.1 10 1.1 3.5-1 3.6-3.6 5.4-5.7.7.3 1.2 1 1.7 1.5 1.2-1.5 2.5-3.3 2-5.3-.6-2.3-2.8-2.6-4-4a8.2 8.2 0 002-4.8c-1.1.6-2.4 1.6-3.7 1.6-.7 0-1.2-1-1.6-1.6-1-1.2-1.8-1-2.9-1.7 1.3-1.7 4.5-2 6.4-2.2 2.6-.2 5.6.2 8 1.7 7.4 4.3 6.3 15.9 1.6 21.4z" />
      <path d="M169 291.3c.5-1.1 2.2-1.2 2.5-2.8.8-3.1-2.8-5.6-2.1-8.6l.5-2.7c-1.6 1.5-6.5 6-9 4.4-.2-.5.2-1.1.5-1.5 1.7-5.7 1.5-11.6 3.2-17.2-3.8-6.3-7-13.6-6.3-21A16 16 0 01165 230c3.5-2.4 7.7-3.2 11.5-2.1 3.5 1 6.7 3.5 8.5 8-2.3.8-4.8.8-7.2 0-3.1-1.2-5.5-.6-7 1a7.3 7.3 0 00-1.7 6c.8 5.6 6 7.8 10.7 4.9 1.8-1 2.7-2.5 4.2-3.8 2.7 1.8 2.4 5.1 2.2 8 2.9-3 5.2-3.4 9.3-4.1v44.7c-1.1 1.2-2.3 2.1-3.6 3-2-1.4-3.5-4.7-3.7-7l-1.8-.5c-.8 2.4-1.2 4.8-3.2 6.5l-.2.1c.6-4.6-2.3-5.3-4-8.9l-1.7.4c0 3-6 5.3-8.3 5.1zm179.2-32.6c-.5 1-1.8 2.1-1 3.4 3.3 4.6 2 10.8 4.2 15.8-1.5 2.6-7.1.4-8.3-1.4l-1.7.6a14 14 0 01-1.1 6.6c-.9 2.2 0 4.9-.2 7.1-2-1.9-3-4.8-4.6-7l-1.3-1.8c-.6 3.7-1.5 7.5-4.3 10.1-1 1-1.6 1-2-.4-.6-1.8-.5-3.8-.5-5.7-2.5 3.7-5 7-9.4 8.5l-.2-47.4c2.5-.5 5.2.4 7.3 1.7.5-1.3.9-4.2 2.3-4.5 3.2 5 9 4.3 12.3-.4 1.4-1.9 2.2-4.3 1.6-6.3-.8-2.8-3.8-3.4-6.3-3.4-2.6 1.1-6 2.2-8.7 1-.4-.3-.7-.5-.5-1A16 16 0 01344 227c11.8 5.9 12.3 22.7 4.2 31.8zm-82.5-29.1c6.8-2 12.2 5.3 13.9 11l.2 1.1c-1.9-1.2-3.5-2.8-5.6-3.6-4.5-1.6-8.9 2.4-13 3.6-2.7.8-5 .2-7-1.8l-1.4-1.3c-.2 2.2-.6 4.3-2.5 5.7-1.8 1.4-5.8.9-7.8-.3-1.6-1-1.8-2.6-2.1-4.2l-1.2 1.2c-.8.9-5.2 1.4-5.8.1-1.8-3.7 5.8-12.7 9.6-11.1 1.6.7 1.8 3.2 2.1 4.7 6-5.7 13.2-3.2 20.6-5z" />
      <path d="M309.4 218.3c3.6-4.6 11.3-7 16.8-4.3 1.5.8 3 2.1 4.2 4.1.5.9-.4 1.1-1 1.5-2.1 1.2-4.8 3.1-7.4 2.7l-1.2-.2c.2 1.2.4 2.1-.4 3.1-1.3 1.6-3.4 2.4-4.2 4.4-.4 1.2-.4 2.5.4 4l1.7-.4c-.1-1.3 2.3-2.6 2.6-1a7.5 7.5 0 005.8 6.4c2.9.7 6.3 0 9.5-1.5 1.3.3 1.8 2 1.8 3.2a25.2 25.2 0 01-7.1 2.6c-.9-1-2-2.5-3.6-2.5s-2.7 1.6-3.4 2.8a18 18 0 01-17-15 13 13 0 012.5-10zm35.7 5.4c1-3 1-5.8.4-8.8-1.4 1.6-2.7 3-5 3.4-.9.2-.7-.1-.3-1 2.5-4.8.6-10.6-.2-15.8-1.2 3-2.4 5.8-5.6 7.2-.4.2-.3-2.2-.3-2.4 0-3.2 0-8.4-3.5-12.8l-1.6.8c.8 3.8-.2 6.3-3.5 8.4-.1.1-.1.2-.3 0-2.8-2.3-3.8-6-6.7-8.2.2 2.4 1.5 7.2-2.1 8.1-1.4.4-3-1.6-4-2.2-.5-1.2-1-2.3-1.9-3.2a9.7 9.7 0 001-10c11.7-5.4 25-2.2 33.6 5.8 8.5 8 12.4 20.6 5.5 34.2a19.7 19.7 0 00-5.5-3.5zm-128.6-37c2.5 3.3 5 6.2 8.7 8 .4-3.4 3.4-9.3 7.7-7.8-1.2 1.8-2.9 2.7-2.6 5.2.4 3.5 3.3 6.2 5 9a6.6 6.6 0 011.2 3.2c-3 2.6-2.1 6 .1 8.7 2 2.3 4.4 4 6.6 6-1.3 2.4-1 5-1.7 7.5-4.9.2-6.8 6.6-11.6 5.4-1.4-.3-2.2.7-3.4.7 0 0-.5-.2-.6-.8-.4-2.7.5-5.3 1.8-7.6a45 45 0 00-9.9-.6c-.3-2.7 1.6-5.3 3.9-7.2l-1-1.5c-1.2.5-5.4 0-6.6-.5V213c-1.5.2-4 1.1-5.3 0-.3-.3.3-1.5.5-1.8.7-1.7 1.6-3.4 2.4-5l-8.1 2.3c-1.1-1-1.3-2.6-.7-4.1a6.1 6.1 0 014.5-3.6l1.8-.4-1.4-1.2c-2-1.7-3.4-4-4-6.5 0-2.2 2.5-5.7 4.6-6.6.3 3.3 0 5.7 2.5 8.3l1.5-.9c-.5-1.4.6-3.4 1.3-4.6.5-.8 1.6-2.5 2.8-2.3zm87.7-2.3c2 .6 3.8 2.7 4.4 5.3 1 3.7-.9 6-3.8 7.8 4 2.3 5.4 6 4.2 10.6-1 2.2-9.4-3.1-10.9-4l2 4.5c.2.5.2.6-.2.8a27 27 0 01-9.4 3l1.5 1.3c1.8 1.7 1.4 4.9 2.7 6.8.3.4.6.7.1.8a20 20 0 01-11.1-1.3c1.8 3.7 1.5 7.2-.7 10.7 0 .2-.3.3-.5.3-2.3-.6-5-4.3-6.8-5.9 0 1 .3 2.3-.1 3.3-.1.2-.3.1-.5 0-2.7-.7-4.7-2.8-7.8-2.7-1.6-2.2-2.6-4.2-2-7.2l.2-.3c6.2-4.3 8.8-13 6.6-20.2a8.6 8.6 0 005.6-12c3.9-1.7 4.5 4.2 7.6 3.5 3.4-.8 5.9-4 7.2-7 3.7 2.5 5.4 5.8 5.7 10.1 2-2.5 3.7-6 6-8.2z" />
      <path d="M282.3 234.8c4-1.9 6-5.8 6.3-10.1 2.8-.3 7 1 9.2-1.2 2.5-2.6-1.7-6.4-1.3-9.1 2.2-1.3 5.8-1 7-3.7 5.4 2 9.6.4 9.6-5.4 1.4.8 3 1 4.3.6a6 6 0 003.8-2.8c.7 1 1.4 2.1 2.4 2.8 2.5 1.8 5.4-1.1 7.2-2.9.2 2.6-.5 6.5 1.4 8.5 1.7 1.8 4.3.1 5.8-1 .1 2 0 3.9-.7 5.5a4.6 4.6 0 00-.6 3.2c.3 1 .9 1.6 1.7 2 1.1.6 2.6.7 4 .3 0 .5-.2 1-.4 1.5-8-1-13.8 2.7-17.9 8.1-.3-1.1-1-2.2-2.2-2.6 1-.8 2-1.7 2.4-2.9 3.1-.7 6-2.4 8.5-4a3 3 0 001.3-3.9c-4-9-17.2-10-24.3-4-5.8 4.7-8.8 13-4.4 21-7.2.1-14.4.7-21.5.3l-1.6-.2zm-59.2-7.8l-.2 2.5c-.1 1.2-.1 2.4.1 3.5.2.9.7 1.6 1.3 2H206c2.6-9.3-3.8-20.8-14.2-21-3.4-.1-7.7.4-10.4 2.8-2 1.7-2.3 4.6.2 5.8a9.3 9.3 0 001.8.6c1 .9 1.2 2.2 2.5 2.8-.4 2.7 2.7 3 4 4.6-1.2 0-2.3.8-3 1.7a16 16 0 00-15.4-8 7 7 0 01-.2-.7c.7.3 1.4.3 2 .2 3-.8 3.2-5.2 3.3-7.7 2 .5 4.2.2 4.5-2.3.2-1.6-.3-3.4.2-5 .9-.9 2-1.6 2.7-2.6a4 4 0 001.8 1.6c2.5 1 4.8-2.5 6.9-3.4.4 1.2.9 2.6 2 3.3 1.6 1 3.5-.2 4.8-1.2 0 1.6.2 3.3 1.3 4.4 1.1 1.2 2.8 1.3 4.8.8l-.1 1.2c0 1 .4 1.8 1.1 2.5 1.2 1 3.1 1.5 5.1 1.4 1.1 1.1 2.8 1 4.2 1-1.2 2-2.6 7.4 0 9 2.2 1.3 4.9-.3 7.2.2z" />
      <path
        fillRule="evenodd"
        d="M231.2 237.4c-2 6.3 2.4 7.5 7.7 6.3 3.2 5.1 13.1 5.7 15.4-.6 3.8 2.7 7.4 1 11.1-.6 3-1.3 5.9-2.6 9-1.8.9 0 1.7 1 2.6 1.9 1.1 1.2 2.3 2.5 3.9 2 2.7-1 1.1-4.9.2-7.1v-.1h26.8a21 21 0 007.5 6.2v36.8H197.8V245c2.8-2 5-4.6 6.4-7.7h27zm63 17.4c0-3.2 1.8-5.8 3-6.6a9 9 0 013 6.6c7-2.8 4.8 8.2 1.5 6.2.8-4.7-4.2-1.1-3.3 4.9 1.7.3 1.5.4 1 .8-.6.5-1.7 1.6 1 4h-1.8c-.2 0-.4.1-1.2.7l-.2.1c-.8-.9-1.2-.8-1.8-.8H294c2.5-2 1.8-3.2 1.3-4-.2-.4-.4-.7.3-.8.8 0 .8-.7.8-1.2v-.2c0-4.6-4.6-8.2-3.7-3.6-3.5 2-5-9 1.6-6zm-81.1 1.2c0-3.3 1.8-5.8 3-6.6a9 9 0 013 6.6c6.9-2.8 4.7 8 1.5 6 .8-4.6-4.2-1-3.3 5 1.6.3 1.4.4 1 .8-.6.6-1.8 1.6 1 4a8.1 8.1 0 01-2 0l-.9.5-.1.1-.3.2c-.8-.9-1.1-.8-1.8-.8h-1.4c2.5-2 1.8-3.2 1.3-4-.2-.4-.4-.7.3-.8.8 0 .8-.7.8-1.2v-.2c0-4.6-4.6-8.1-3.6-3.6-3.6 1.9-5.1-8.9 1.5-6zm51.7 9.6l-.4 2.3c-7.2 1.1.4 3.6 3.3 2.1 1.5-7.2 4.2-6.8 9.8-3.4-1.6.6-3.1 1.2-3.8 2.8 5 1.2 11-5.1 4.4-6a10.8 10.8 0 01-2.6-3.8l-1-2-.3-.6.4-.4 1-.8c5-5-3.5-6.8-7.5-4.6l-.8.4c-3.2 1.3-10.7 4.5-8.8-.8 1-9.6-10.3 12.6 7.5 2.4 10.3-5.2 11.9 1.8 4 2.6-2.1 0-4.5.5-6.7 1-5.5 1.4-10.5 2.5-12.2-5 1.3-2.1-12.3-2.5-9.2 2.4 4.2 0-2.7 2-3.6-1.2.2 3.5 2.7 3 4.9 2.5-.2.5-.5.8-1.1.2-.1 2.3.7 2 2 1.4l.4-.2c1.4 3.6-2.2 2.6-5.5 1.6-2.7-.8-5.2-1.6-4.9.1 13.7 7.6 10.5 8 6.4 8.4-2.3.3-4.9.5-5 2.1 14 2 18.3 1.4 30-6.8-.4 1-.5 2.2-.7 3.3z"
        clipRule="evenodd"
      />
      <path d="M265 226.6c-2.8-1.7-2.2-4.6-2.3-7.2a18 18 0 01-16.8.9c-1.8 2.4-1 4.8-2 7.5 1.1.5 2 1.4 2.7 2.5 2.7-3.6 21-2.1 18.3-3.7zM200 334c-2.2-1.5-4.6 2-2.4 3.7l8.1 5.8c2.2 1.5 4.7-2 2.4-3.6l-8-5.9zm115.2 3.6c2.3-1.7-.3-5.2-2.5-3.5l-8 5.7c-2.3 1.7.3 5.3 2.5 3.7l8-6zm-52.7-174.9c3.2-7.1-2.7-17.3-10.8-14.1-1.4 2-4.1.9-5.8 2.5-3.1 2.5-.2 5.4 3.3 4.5-1.3 1.3-4.3 0-5.8.3-1.6.3-2-.9-2.8-1.7-1.2.1-.5 1.5.4 2.3 1 .7 2.3.4 3.4.4 2.7-.6 1.4 3 3.8 2.7 12-1.5-1.8 3.1-1.2 12.2-.5 3.4-.5 6.9-.9 10.2-2.4 1.5-9 1.7-2.8 4.8 6.1 3.3 8.8-6 21.3 1.7 2-.8 4.3-3.5 1.8-4.7-6-4.9-6.2-14-4-21z" />
    </g>
  </svg>
);

export default Social;
