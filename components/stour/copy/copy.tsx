import { useEffect, useState } from "react";
import cn from "classnames";

const Copy: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  // When copied is set to true, set it back to false after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <button
      className="inline-flex items-center gap-1 group"
      onClick={() => copy()}
    >
      <span className="font-medium tracking-wider text-black select-all disambiguate">
        {value}
      </span>
      <span className="relative items-center hidden text-xs font-semibold text-blue-500 transition opacity-0 select-none md:flex group-hover:opacity-100">
        <span
          className={cn(
            "absolute transition",
            copied ? "opacity-0" : "opacity-100"
          )}
        >
          Copy
        </span>
        <span
          className={cn(
            "absolute transition",
            copied ? "opacity-100" : "opacity-0"
          )}
        >
          Copied
        </span>
      </span>
    </button>
  );
};

export default Copy;
