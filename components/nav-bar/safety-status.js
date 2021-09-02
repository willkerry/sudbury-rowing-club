import safety from "../../data/safety.json";
import cn from "classnames";
import Link from "next/link";

function StatusIndicator() {
  const status = safety.status.severity;
  const grades = { 0: "Neutral", 1: "Green", 2: "Amber", 3: "Red" };
  return (
    <Link href="/safety" passHref>
      <a
        className={cn(
          "flex items-center px-1.5 py-1 rounded font-semibold text-xs",
          {
            "bg-red-100": status == grades[3],
            "bg-yellow-100": status == grades[2],
            "bg-green-100": status == grades[1],
            "bg-blue-100": status == grades[0],
          }
        )}
      >
        <div
          className={cn(
            "inline-block w-3 h-3 mr-1 rounded-full animate-pulse",
            {
              "bg-red-500": status == grades[3],
              "bg-yellow-600": status == grades[2],
              "bg-green-500": status == grades[1],
              "bg-blue-500": status == grades[0],
            }
          )}
        />
        <span
          className={cn("pt-px", {
            "text-red-900": status == grades[3],
            "text-yellow-900": status == grades[2],
            "text-green-900": status == grades[1],
            "text-blue-800": status == grades[0],
          })}
        >
          <span className="lg:sr-only">{status}</span>
          <span className="hidden lg:inline">River status</span>
        </span>
      </a>
    </Link>
  );
}
export default function SafetyStatus() {
  return safety.status.display && <StatusIndicator />;
}
