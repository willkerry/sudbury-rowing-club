import ordinal from "ordinal";
import Link from "next/link";
import { ExternalLink } from "react-feather";
import DateFormatter from "@/components/date-formatter";
import Note from "@/components/stour/note";
import cn from "classnames";

function Results({ tab, data }) {
  const resultsData = data.results.results;
  const courseRecords = data.results.courseRecords;
  return (
    <>
      <div className={cn(tab && "mx-auto", "pb-16 prose")}>
        <p className="lead">
          At Sudbury Rowing Club we take your results very seriously.
        </p>
        <p>
          We have an archive of regatta results that stretches back to 2002, and
          an{" "}
          <Link href={courseRecords}>
            extremely detailed log of the course records (PDF)
          </Link>{" "}
          set since 2005.
        </p>
        <p>
          Before each regatta, once the draw is available, we provide prominent
          access to it across our website. Over the regatta’s course, that
          ‘draw’ is populated with live results. Hit refresh on the draw after
          each division to see full provisional results.
        </p>
        <Note label="Mobile users" type="secondary" className="sm:hidden">
          Our results software pre-dates the mobile web. We’re working on it,
          but for now we acknowledge our results pages are difficult to navigate
          on mobile devices.
        </Note>
      </div>
      <div className="prose prose-lg max-w-none">
        <table>
          <thead>
            <th className="hidden sm:table-cell"></th>
            <th>Date</th>
            <th className="hidden md:table-cell">Fastest 350m</th>
            <th className="hidden md:table-cell">Fastest 650m</th>
            <th>Results</th>
          </thead>
          <tbody>
            {resultsData.map(
              ({ link, year, date, fastest, eightsFastest, number, index }) => (
                <tr key={index} className="hover:bg-gray-50">
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
                  <td className="hidden md:table-cell">
                    <span className="font-semibold text-pink-500 tabular-nums">
                      {eightsFastest}
                    </span>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="font-semibold text-pink-500 tabular-nums">
                      {fastest}
                    </span>
                  </td>
                  <td>
                    {link ? (
                      <Link href={link} passHref>
                        <a
                          className="inline-block pr-4 last-of-type:pr-0"
                          title={"View the " + year + " regatta results."}
                        >
                          View<span className="hidden sm:inline"> results</span>
                          <ExternalLink
                            size={12}
                            className="inline mb-1 ml-1"
                          />
                        </a>
                      </Link>
                    ) : null}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Results;
