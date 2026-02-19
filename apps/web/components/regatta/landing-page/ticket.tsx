import type { JSX } from "react";

export const Ticket = ({
  items,
}: {
  items: [string, string | JSX.Element][];
}) => (
  <div
    className="relative -rotate-6 rounded-lg bg-linear-to-tr from-gray-300 to-white drop-shadow-2xl"
    style={{
      clipPath:
        "path('M159 0a15 15 0 0115 15v185a15 15 0 000 30v57a15 15 0 01-14 15l-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6h-1a15 15 0 01-15-15v-57a15 15 0 000-30V15A15 15 0 0115 0l6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6z')",
      height: 302,
      width: 174,
    }}
  >
    <div className="-m-1 border-b bg-blue-950 px-2 pt-3 pb-0.5 text-center font-bold text-[11px] text-white uppercase tracking-wider">
      Sudbury Rowing Club
    </div>
    <div
      className="absolute right-0 bottom-0 left-0 bg-blue-950"
      style={{
        height: 10,
      }}
    />
    <div className="space-y-1.5 px-3 py-3">
      {items.map((item) => (
        <div key={item[0].toString()}>
          <div className="font-bold text-[9px] text-gray-500 uppercase tracking-widest">
            {item[0]}
          </div>
          <div className="whitespace-pre-line font-medium font-mono text-[11px]">
            {item[1]}
          </div>
        </div>
      ))}
    </div>
    {/* biome-ignore lint/a11y/noSvgWithoutTitle: aria-hidden is used to hide the SVG from screen readers */}
    <svg
      aria-hidden
      className="absolute bottom-0 left-10 mb-5"
      fill="currentColor"
      height="87"
      viewBox="0 0 29 29"
      width="87"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h1v1H0zm1 0h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm1 0h1v1H5zm1 0h1v1H6zm4 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM0 1h1v1H0zm6 0h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm5 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm2 0h1v1h-1zm6 0h1v1h-1zM0 2h1v1H0zm2 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm2 0h1v1H6zm6 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zM0 3h1v1H0zm2 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm2 0h1v1H6zm2 0h1v1H8zm1 0h1v1H9zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm5 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zM0 4h1v1H0zm2 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm2 0h1v1H6zm3 0h1v1H9zm5 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zM0 5h1v1H0zm6 0h1v1H6zm2 0h1v1H8zm1 0h1v1H9zm2 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm2 0h1v1h-1zm6 0h1v1h-1zM0 6h1v1H0zm1 0h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm1 0h1v1H5zm1 0h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM9 7h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zM0 8h1v1H0zm1 0h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm2 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm1 0h1v1H9zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zM0 9h1v1H0zm1 0h1v1H1zm2 0h1v1H3zm7 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zM0 10h1v1H0zm2 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm2 0h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zM0 11h1v1H0zm3 0h1v1H3zm1 0h1v1H4zm3 0h1v1H7zm5 0h1v1h-1zm6 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zM2 12h1v1H2zm1 0h1v1H3zm3 0h1v1H6zm1 0h1v1H7zm2 0h1v1H9zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm6 0h1v1h-1zm1 0h1v1h-1zM1 13h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm1 0h1v1H5zm2 0h1v1H7zm2 0h1v1H9zm7 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zM0 14h1v1H0zm1 0h1v1H1zm2 0h1v1H3zm1 0h1v1H4zm2 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm1 0h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM0 15h1v1H0zm1 0h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm4 0h1v1H7zm1 0h1v1H8zm2 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zM0 16h1v1H0zm1 0h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm3 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm2 0h1v1h-1zm1 0h1v1h-1zm6 0h1v1h-1zm2 0h1v1h-1zm6 0h1v1h-1zm1 0h1v1h-1zM0 17h1v1H0zm2 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm1 0h1v1H5zm2 0h1v1H7zm1 0h1v1H8zm1 0h1v1H9zm3 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zM0 18h1v1H0zm4 0h1v1H4zm2 0h1v1H6zm1 0h1v1H7zm3 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zM0 19h1v1H0zm4 0h1v1H4zm1 0h1v1H5zm5 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm6 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zM0 20h1v1H0zm3 0h1v1H3zm1 0h1v1H4zm1 0h1v1H5zm1 0h1v1H6zm1 0h1v1H7zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM8 21h1v1H8zm2 0h1v1h-1zm6 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM0 22h1v1H0zm1 0h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm1 0h1v1H5zm1 0h1v1H6zm2 0h1v1H8zm1 0h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM0 23h1v1H0zm6 0h1v1H6zm3 0h1v1H9zm2 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm3 0h1v1h-1zM0 24h1v1H0zm2 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm2 0h1v1H6zm2 0h1v1H8zm1 0h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM0 25h1v1H0zm2 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm2 0h1v1H6zm2 0h1v1H8zm4 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM0 26h1v1H0zm2 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm2 0h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM0 27h1v1H0zm6 0h1v1H6zm2 0h1v1H8zm1 0h1v1H9zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zM0 28h1v1H0zm1 0h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm1 0h1v1H5zm1 0h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z" />
    </svg>
  </div>
);
