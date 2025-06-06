import TextPage from "@/components/layouts/text-page";
import { Error as ErrorComponent } from "@/components/ui/error";
import { createMetadata } from "@/lib/create-metadata";
import { scrapeRatesTable } from "@/lib/scrapeRatesTable";
import { TagIcon } from "lucide-react";

export const revalidate = 60;

export const metadata = createMetadata({
  title: "Membership Rates",
  description: "Membership rates for Sudbury Rowing Club.",
  image: { title: "Membership Rates 💸" },
});

const MembershipRates = async () => {
  const rates = await scrapeRatesTable();

  return (
    <TextPage title="Membership rates">
      <p>
        The values on this page are periodically retrieved from the definitive{" "}
        <a href="https://sudburyrowingclub.myclubhouse.co.uk/Register/MembershipCategories">
          membership categories page
        </a>{" "}
        on MyClubhouse.
      </p>

      {rates.status === "error" && (
        <ErrorComponent error={{ message: rates.message }} />
      )}

      {rates.status === "success" && (
        <table>
          <thead>
            <tr className="text-left">
              <th>Category</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {rates.data.map((rate) => (
              <tr key={rate.ID}>
                <td>
                  <strong className="block leading-6">{rate.Name}</strong>

                  <div className="text-xs">{rate.Category.Description}</div>

                  {rate.Category.Restrictions && (
                    <div className="mt-1 flex items-start gap-1 font-medium text-red-700 text-xs">
                      <TagIcon
                        aria-hidden
                        className="mt-0.5 h-3 w-3 shrink-0"
                      />
                      {rate.Category.Restrictions}
                    </div>
                  )}
                </td>
                <td>
                  <div className="disambiguate font-medium text-sm tabular-nums leading-6">
                    {Intl.NumberFormat("en-GB", {
                      currency: "GBP",
                      style: "currency",
                    }).format(rate.Cost.InclTax.Value)}
                  </div>
                  <div className="font-medium text-gray-500 text-xs">
                    {rate.DurationDescription}
                  </div>

                  {rate.HasEarlyPaymentOption ? (
                    <>
                      <div className="disambiguate mt-2 font-medium tabular-nums">
                        {Intl.NumberFormat("en-GB", {
                          currency: "GBP",
                          style: "currency",
                        }).format(rate.EarlyPaymentCost.InclTax.Value)}
                      </div>
                      <div className="font-medium text-gray-500 text-xs">
                        if paid within {rate.EarlyPaymentDeadlineDaysAbs}
                        {Intl.NumberFormat("en-GB", {
                          style: "unit",
                          unit: "day",
                        }).format(rate.EarlyPaymentDeadlineDaysAbs)}{" "}
                        of season start
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
};

export default MembershipRates;
