import ordinal from "@/lib/helpers/ordinal";
import DateFormatter from "@/components/date-formatter";
import Note from "@/components/stour/note";
import cn from "classnames";
import Link from "@/components/stour/link";
import { Download } from "react-feather";
import Button from "@/components/stour/button";

function Results({ tab, children, results, records }) {
  return (
    <>
      <div className={cn(tab && "mx-auto", "mb-12 space-y-12")}>
        {children}
        {records && (
          <Button href={`${records}?dl=`} iconRight={<Download />}>
            Course records
          </Button>
        )}
        <Note label="Mobile users" type="warning" className="sm:hidden">
          Our results software pre-dates the mobile web. We’re working on it,
          but for now we acknowledge our results pages are difficult to navigate
          on mobile devices.
        </Note>
      </div>
      <div className="prose prose-lg max-w-none">
        <table>
          <thead>
            <tr>
              <th className="hidden sm:table-cell"/>
              <th>Date</th>
              <th>Results</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ results, date, number }, index) => (
              <tr key={date.toString() + index} className="hover:bg-gray-50">
                <td className="hidden sm:table-cell">
                  <span className="font-semibold">
                    {number
                      ? ordinal(number)
                      : new Date(date).toLocaleDateString("en-GB", {
                          year: "numeric",
                        })}
                    <span className="hidden lg:inline"> Sudbury Regatta</span>
                  </span>
                </td>
                <td>
                  <span className="tabular-nums">
                    <DateFormatter dateString={date} />
                  </span>
                </td>

                <td>
                  {results ? (
                    <Link
                      href={results}
                      external
                      aria-label={`View results from the ${date} regatta.`}
                    >
                      View<span className="hidden sm:inline"> results</span>
                    </Link>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Results;
