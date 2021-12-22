import Link from "next/link";
import data from "@/data/alert";

export default function Alert() {
  return (
    data.display && (
      <div className="py-2 overflow-hidden border-b">
        <div className="relative px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-center">
            <div className="text-sm font-medium text-gray-900">
              {data.description}
            </div>
            <span
  aria-hidden="true"
  className="hidden w-px h-6 mx-6 bg-black sm:block bg-opacity-20"
  />
            <div className="ml-6 sm:ml-0">
              <Link href={data.href}>
                <a
                  className="p-2 text-xs font-semibold text-gray-800 uppercase transition bg-white border rounded-md inline-flexpx-3 hover:border-gray-900 whitespace-nowrap hover:bg-opacity-90"
                  href="/docs/just-in-time-mode"
                >
                  <span>{data.linkText}</span>
                  <span className="font-mono"> →</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
