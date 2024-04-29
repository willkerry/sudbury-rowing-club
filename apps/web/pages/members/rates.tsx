import { InferGetStaticPropsType } from "next";
import { AlertTriangle } from "lucide-react";
import { scrapeRatesTable } from "@/lib/scrapeRatesTable";
import TextPage from "@/components/layouts/text-page";
import Note from "@/components/stour/note";

export const getStaticProps = async () => {
  try {
    const rates = await scrapeRatesTable();

    return {
      props: {
        rates,
      },
    };
  } catch (error) {
    return {
      props: {
        rates: null,
        error: "Failed to scrape rates",
      },
    };
  }
};

const MembershipRates = ({
  error,
  rates,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <TextPage title="Membership Rates" color="transparent">
    <p>
      The values on this page are periodically retrieved from the definitive{" "}
      <a href="https://sudburyrowingclub.myclubhouse.co.uk/Register/MembershipCategories">
        membership categories page
      </a>{" "}
      on MyClubhouse.
    </p>

    {error ? (
      <Note label="Error" type="error">
        {error}
      </Note>
    ) : (
      <table>
        <thead>
          <tr className="text-left">
            <th>Category</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {rates?.map((rate) => (
            <tr key={rate.ID}>
              <td>
                <strong className="block leading-6">{rate.Name}</strong>

                <div className="text-xs">{rate.Category.Description}</div>

                {rate.Category.Restrictions && (
                  <div className="mt-1 flex items-center gap-1 text-xs font-medium text-red-700">
                    <AlertTriangle className="inline-block h-3 w-3" />
                    {rate.Category.Restrictions}
                  </div>
                )}
              </td>
              <td>
                <div className="disambiguate text-sm font-medium tabular-nums leading-6">
                  {rate.Cost.Formatted}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  {rate.DurationDescription}
                </div>

                {rate.HasEarlyPaymentOption ? (
                  <>
                    <div className="disambiguate mt-2 font-medium tabular-nums">
                      {rate.EarlyPaymentCost.Formatted}
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                      if paid within {rate.EarlyPaymentDeadlineDaysAbs} days of
                      season start
                    </div>
                  </>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </TextPage>
);

export default MembershipRates;
