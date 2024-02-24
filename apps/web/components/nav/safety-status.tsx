import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import cn from "clsx";
import groq from "groq";
import { sanityClient } from "@sudburyrc/api";
import Loading from "../stour/loading";

const grades = ["neutral", "green", "amber", "red"];

type StatusShellProps = {
  grade: 0 | 1 | 2 | 3 | null;
  text: string | React.ReactNode;
};

const StatusShell = ({ grade, text }: StatusShellProps) => {
  const bgClass = {
    "hover:bg-red-600 hover:border-red-600 text-red-600": grade === 3,
    "hover:bg-yellow-600 hover:border-yellow-600 text-yellow-600": grade === 2,
    "hover:bg-green-600 hover:border-green-600 text-green-600": grade === 1,
    "hover:bg-blue-600 hover:border-blue-600 text-blue-600": grade === 0,
    "hover:bg-gray-900 hover:border-gray-900 text-gray-600": grade === null,
  };
  const dotClass = {
    "bg-red-500 animate-pulse group-hover:bg-red-200": grade === 3,
    "bg-yellow-500 animate-pulse group-hover:bg-yellow-100": grade === 2,
    "bg-green-500 group-hover:bg-green-200": grade === 1,
    "bg-blue-500 group-hover:bg-blue-200": grade === 0,
    "bg-gray-900 group-hover:bg-gray-200": grade === null,
  };
  return (
    <Link
      href="/safety"
      className={cn(
        "group ml-1 flex items-center rounded-full border px-2 py-1 text-xs font-medium transition duration-300",
        bgClass,
      )}
      title={`River safety status: ${text}`}
    >
      <>
        <div
          className={cn(
            "mr-1.5 h-2.5 w-2.5 rounded-full duration-300",
            dotClass,
          )}
        />
        <span className="font-medium transition duration-300 group-hover:text-white">
          <span className="sr-only">River safety status:</span>
          <span className="capitalize">{text}</span>
        </span>
      </>
    </Link>
  );
};

const StatusIndicator = () => {
  const { data, status: queryStatus } = useQuery({
    queryKey: ["safetyStatus"],
    queryFn: () =>
      sanityClient.fetch(
        groq`*[_id == "safetyStatus" && !(_id in path("drafts.**"))][0]{display, status}`,
      ),
  });

  if (queryStatus === "error") return <div>Unavailable</div>;
  if (queryStatus === "pending")
    return <StatusShell grade={null} text={<Loading />} />;

  const { status, display } = data;
  const statusIndex = grades.indexOf(status);

  const grade =
    statusIndex < 0 || statusIndex > 3
      ? null
      : (statusIndex as 0 | 1 | 2 | 3 | null);

  if (display) return <StatusShell {...{ grade }} text={grades[statusIndex]} />;
  return null;
};

export default function SafetyStatus() {
  return <StatusIndicator />;
}
