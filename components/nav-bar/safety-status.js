import safety from "../../data/safety.json";
import cn from "classnames";
import Link from "next/link";
import useSWR from "swr";
import { sanityClient } from "@/lib/sanity.server";
import groq from "groq";
import Loading from "../stour/loading";

function StatusIndicator() {
  const { data, error } = useSWR(
    groq`*[_id == "safetyStatus" && !(_id in path("drafts.**"))][0]{display, status}`,
    (query) => sanityClient.fetch(query)
  );
  if (error) return <div>Unavailable</div>;
  if (!data) return Loading();
  const status = data.status;
  const grades = { 0: "neutral", 1: "green", 2: "amber", 3: "red" };
  const getStatusName =
    status === grades[3]
      ? "Red"
      : status === grades[2]
      ? "Amber"
      : status === grades[1]
      ? "Green"
      : status === grades[0]
      ? "Neutral"
      : "";
  return (
    data.display && (
      <Link href="/safety" passHref>
        <a
          className={cn(
            "flex items-center ml-1 px-2 py-1 rounded-full font-medium text-xs border group transition duration-300",
            {
              "hover:bg-red-600 hover:border-red-600": status == grades[3],
              "hover:bg-yellow-600 hover:border-yellow-600":
                status == grades[2],
              "hover:bg-green-600 hover:border-green-600": status == grades[1],
              "hover:bg-blue-600 hover:border-blue-600": status == grades[0],
            }
          )}
          title={`River safety status: ${getStatusName}`}
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
            className={cn(
              "font-medium group-hover:text-white transition duration-300",
              {
                "text-red-600": status == grades[3],
                "text-yellow-600": status == grades[2],
                "text-green-600": status == grades[1],
                "text-blue-600": status == grades[0],
              }
            )}
          >
            <span className="sr-only">River safety status: {status}</span>
            <span className="">{getStatusName}</span>
          </span>
        </a>
      </Link>
    )
  );
}
export default function SafetyStatus() {
  return safety.status.display && <StatusIndicator />;
}
