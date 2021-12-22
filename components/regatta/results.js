import cn from "classnames";
import { Download } from "react-feather";
import PropTypes from "prop-types";
import ordinal from "@/lib/helpers/ordinal";
import DateFormatter from "@/components/date-formatter";
import Note from "@/components/stour/note";
import Link from "@/components/stour/link";
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
              <th className="sr-only">Regatta</th>
              <th>Date</th>
              <th>Results</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ results: resultsLink, date, number, _id }) => (
              <tr key={_id} className="hover:bg-gray-50">
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
                  {resultsLink ? (
                    <Link
                      href={resultsLink}
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

Results.defaultProps = {
  tab: false,
  children: null,
  results: [],
  records: null,
};

Results.propTypes = {
  /**
   * Center the results table (originally to look good in a tabbed interface).
   * @default false
   * @type {boolean}
   */
  tab: PropTypes.bool,
  /**
   * Optionally provide a message to display above the results table.
   * @type {string}
   * @default null
   * @optional
   */
  children: PropTypes.node,
  /**
   * The results to display.
   * @type {array}
   * @default []
   * @required
   */
  results: PropTypes.arrayOf(
    PropTypes.shape({
      results: PropTypes.string,
      date: PropTypes.string,
      number: PropTypes.number,
      _id: PropTypes.string,
    })
  ),
  /**
   * The link to the course records.
   * @type {string}
   * @default null
   * @optional
   */
  records: PropTypes.string,
};

export default Results;
