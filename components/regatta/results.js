import ordinal from "ordinal";
import DateFormatter from "@/components/date-formatter";
import Note from "@/components/stour/note";
import cn from "classnames";
import Link from "@/components/stour/link";

function Results({ tab, children, results }) {
  return (
    <>
      <div className={cn(tab && "mx-auto", "mb-12")}>
        {children}
        <Note label="Mobile users" type="secondary" className="sm:hidden">
          Our results software pre-dates the mobile web. We’re working on it,
          but for now we acknowledge our results pages are difficult to navigate
          on mobile devices.
        </Note>
        <p>
          <Link href="" download>
            Course records
          </Link>
        </p>
      </div>
      <div className="prose prose-lg max-w-none">
        <table>
          <thead>
            <tr>
              <th className="hidden sm:table-cell"></th>
              <th>Date</th>
              <th>Results</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ results, date, number }, index) => (
              <tr key={date.toString() + index} className="hover:bg-gray-50">
                <td className="hidden sm:table-cell">
                  <span className="font-semibold">
                    {ordinal(number)}
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
