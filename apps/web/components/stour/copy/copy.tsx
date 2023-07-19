import { useEffect, useState } from "react";
import cn from "clsx";
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
      className="group inline-flex items-center gap-1"
      onClick={() => copy()}
    >
      <span className="disambiguate select-all font-medium tracking-wider text-black">
        {value}
      </span>
      <span className="relative hidden select-none items-center text-xs font-semibold text-blue-500 opacity-0 transition group-hover:opacity-100 md:flex">
        <ClipboardDocumentListIcon
          className={cn(
            "absolute h-4 w-4 transition",
            copied ? "opacity-0" : "opacity-100"
          )}
        />
        <ClipboardDocumentCheckIcon
          className={cn(
            "absolute h-4 w-4 transition",
            copied ? "opacity-100" : "opacity-0"
          )}
        />
        {copied && (
          <div className="absolute h-4 w-4 animate-ping rounded-full bg-blue-500" />
        )}
      </span>
    </button>
  );
};

export default Copy;
