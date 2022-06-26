import cn from "classnames";
import { Download } from "react-feather";
import ordinal from "@/lib/helpers/ordinal";
import DateFormatter from "@/components/utils/date-formatter";
import Link from "@/components/stour/link";
import Button from "@/components/stour/button";
import Note from "@/components/stour/note";

type Result = {
  _id: string;
  results: string;
  date: Date;
  number: number;
};

type Props = {
  tab?: boolean;
  children: React.ReactNode;
  records: string;
  results: Result[];
};

const Results = ({ tab = false, children, records, results }: Props) => (
  <>
    <div className={cn(tab && "mx-auto", "mb-12 space-y-12")}>
      {children}
      {records && (
        <Button href={`${records}?dl=`} icon={<Download />} as="a">
          Course records
        </Button>
      )}
      <Note label="Mobile users" type="warning" className="sm:hidden">
        Our results software pre-dates the mobile web. We’re working on it, but
        for now we acknowledge our results pages are difficult to navigate on
        mobile devices.
      </Note>
    </div>
    <div className="prose prose-lg max-w-none">
      <table>
        <thead>
          <tr>
            <th>Regatta</th>
            <th>Date</th>
            <th>Results</th>
          </tr>
        </thead>
        <tbody>
          {results.map(({ results: resultsLink, date, number, _id }) => (
            <tr key={_id} className="hover:bg-gray-50">
              <td className="">
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

export default Results;
