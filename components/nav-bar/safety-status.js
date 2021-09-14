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
          "flex items-center ml-1 px-2 py-1 rounded-full font-medium text-xs border group transition duration-300",
          {
            "hover:bg-red-600 hover:border-red-600": status == grades[3],
            "hover:bg-yellow-600 hover:border-yellow-600": status == grades[2],
            "hover:bg-green-600 hover:border-green-600": status == grades[1],
            "hover:bg-blue-600 hover:border-blue-600": status == grades[0],
          }
        )}
        title={`River safety status: ${status}`}
      >
        <div
          className={cn("w-2.5 h-2.5 mr-1.5 rounded-full duration-300", {
            "bg-red-500 animate-pulse group-hover:bg-red-200":
              status == grades[3],
            "bg-yellow-500 animate-pulse group-hover:bg-yellow-100":
              status == grades[2],
            "bg-green-500 group-hover:bg-green-200": status == grades[1],
            "bg-blue-500 group-hover:bg-blue-200": status == grades[0],
          })}
        />
        <span
          className={cn("font-medium group-hover:text-white transition duration-300", {
            "text-red-600": status == grades[3],
            "text-yellow-600": status == grades[2],
            "text-green-600": status == grades[1],
            "text-blue-600": status == grades[0],
          })}
        >
          <span className="sr-only">River safety status: {status}</span>
          <span className="">{status}</span>
        </span>
      </a>
    </Link>
  );
}
export default function SafetyStatus() {
  return safety.status.display && <StatusIndicator />;
}
