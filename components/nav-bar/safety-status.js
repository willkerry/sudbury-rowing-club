import safety from "../../data/safety.json";
import cn from "classnames";
import Link from "next/link";

export default function SafetyStatus() {
  return (
    <>
      {safety.status.display ? (
        <Link href="/safety#status">
          <a
            className={cn(
              "flex items-center px-1.5 py-1 ml-3 rounded font-semibold text-xs ",
              {
                "bg-white border-red-500": safety.status.severity == "Red",
                "bg-yellow-50": safety.status.severity == "Amber",
                "bg-green-50": safety.status.severity == "Green",
                "bg-sudbury-lightest": safety.status.severity == "Neutral",
              }
            )}
          >
            <div
              className={cn(
                "inline-block w-3 h-3 mr-1 rounded-full animate-pulse",
                {
                  "bg-red-500": safety.status.severity == "Red",
                  "bg-yellow-600": safety.status.severity == "Amber",
                  "bg-green-500": safety.status.severity == "Green",
                  "bg-sudbury": safety.status.severity == "Neutral",
                }
              )}
            />
            <span
              className={cn("pt-px", {
                "text-red-900": safety.status.severity == "Red",
                "text-yellow-900": safety.status.severity == "Amber",
                "text-green-900": safety.status.severity == "Green",
                "text-sudbury-brand": safety.status.severity == "Neutral",
              })}
            >
              <span className="sr-only">{safety.status.severity}</span>River status
            </span>
          </a>
        </Link>
      ) : null}
    </>
  );
}
