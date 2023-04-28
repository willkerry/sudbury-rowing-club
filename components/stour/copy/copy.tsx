import { useEffect, useState } from "react";
import cn from "classnames";
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/20/solid";

const Copy: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  // When copied is set to true, set it back to false after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 1000);
      return () => clearTimeout(timeout);
    }

    return () => {};
  }, [copied]);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 group"
      onClick={() => copy()}
    >
      <span className="font-medium tracking-wider text-black select-all disambiguate">
        {value}
      </span>
      <span className="relative items-center hidden text-xs font-semibold text-blue-500 transition opacity-0 select-none md:flex group-hover:opacity-100">
        <ClipboardDocumentListIcon
          className={cn(
            "w-4 h-4 absolute transition",
            copied ? "opacity-0" : "opacity-100"
          )}
        />
        <ClipboardDocumentCheckIcon
          className={cn(
            "w-4 h-4 absolute transition",
            copied ? "opacity-100" : "opacity-0"
          )}
        />
        {copied && (
          <div className="absolute w-4 h-4 bg-blue-500 rounded-full animate-ping" />
        )}
      </span>
    </button>
  );
};

export default Copy;
