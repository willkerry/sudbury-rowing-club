import { status } from "../../data/safety.json";
import cn from "classnames";
import Link from "next/link";

export default function SafetyStatus() {
  return (
    <>
      {status.display ? (
        <Link href="/safety#status">
          <a
            className={cn(
              "flex items-center px-1.5 py-1 ml-3 rounded font-semibold text-xs ",
              {
                "bg-white border-red-500": status.severity == "Red",
                "bg-yellow-50": status.severity == "Amber",
                "bg-green-50": status.severity == "Green",
                "bg-sudbury-lightest": status.severity == "Neutral",
              }
            )}
          >
            <div
              className={cn(
                "inline-block w-3 h-3 mr-1 rounded-full animate-pulse",
                {
                  "bg-red-500": status.severity == "Red",
                  "bg-yellow-600": status.severity == "Amber",
                  "bg-green-500": status.severity == "Green",
                  "bg-sudbury": status.severity == "Neutral",
                }
              )}
            />
            <span
              className={cn("pt-px", {
                "text-red-900": status.severity == "Red",
                "text-yellow-900": status.severity == "Amber",
                "text-green-900": status.severity == "Green",
                "text-sudbury-brand": status.severity == "Neutral",
              })}
            >
              <span class="sr-only">{status.severity}</span>River status
            </span>
          </a>
        </Link>
      ) : null}
    </>
  );
}
