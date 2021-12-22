export default function Loading(className, children) {
  return (
    <div
      className={`w-full h-full min-w-[48px] inline-flex items-center relative text-base min-h-[1em] ${className}`}
    >
      <span className="absolute flex items-center content-center justify-center w-full h-full -translate-x-1/2 -translate-y-1/2 bg-transparent select-none top-1/2 left-1/2">
        {children && (
          <span className="mr-2 leading-none text-gray-600">{children}</span>
        )}
        <Dot />
        <Dot />
        <Dot />
      </span>
    </div>
  );
}

function Dot() {
  return (
    <>
      <i className="inline-block w-1 h-1 mx-0.5 bg-gray-600 rounded-full" />
      <style jsx>{`
        i {
          animation: loading-blink 1.4s infinite both;
        }
        i:nth-child(2) {
          animation-delay: 0.2s;
        }
        i:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes loading-blink {
          0% {
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </>
  );
}
