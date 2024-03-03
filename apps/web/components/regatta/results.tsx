import { Download } from "lucide-react";
import ordinal from "@/lib/helpers/ordinal";
import { cn } from "@/lib/utils";
import Link from "@/components/stour/link";
import { Button } from "@/components/ui/button";
import DateFormatter from "@/components/utils/date-formatter";

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
    <div className={cn(tab ? "mx-auto mb-6" : "mb-12", "space-y-12")}>
      {children}
      {records && (
        <Button icon={<Download />}>
          <a href={`${records}?dl=`}>Course records</a>
        </Button>
      )}
    </div>
    <div className={cn("prose max-w-none", tab ? "prose-sm" : "prose-lg")}>
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
              <td className={cn(tab && "py-1")}>
                <span className="font-semibold">
                  {number
                    ? ordinal(number)
                    : new Date(date).toLocaleDateString("en-GB", {
                        year: "numeric",
                      })}
                  <span className="hidden lg:inline"> Sudbury Regatta</span>
                </span>
              </td>
              <td className={cn(tab && "py-1")}>
                <span className="tabular-nums">
                  <DateFormatter dateString={date} />
                </span>
              </td>

              <td className={cn(tab && "py-1")}>
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
