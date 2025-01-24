import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import TextPage from "@/components/layouts/text-page";
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
const t = await getTranslations("members/membership-rates");

  const rates = await scrapeRatesTable();

  return (
    <TextPage title="Membership Rates" color="transparent">
      <p>{t('membership-categories-info', { "component0": <a href="https://sudburyrowingclub.myclubhouse.co.uk/Register/MembershipCategories">{t('membership-categories-info_component0')}</a> })}
        </p>

      <table>
        <thead>
          <tr className="text-left">
            <th>{t('category-title')}</th>
            <th>{t('cost-title')}</th>
          </tr>
        </thead>
        <tbody>
          {rates?.map((rate) =>  {
const t = useTranslations("members/membership-rates");

return (
            <tr key={rate.ID}>
              <td>
                <strong className="block leading-6">{rate.Name}</strong>

                <div className="text-xs">{rate.Category.Description}</div>

                {rate.Category.Restrictions && (
                  <div className="mt-1 flex items-start gap-1 font-medium text-red-700 text-xs">
                    <TagIcon aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
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
                    <div className="font-medium text-gray-500 text-xs">{t('payment-deadline')}{rate.EarlyPaymentDeadlineDaysAbs}
                      {Intl.NumberFormat("en-GB", {
                        style: "unit",
                        unit: "day",
                      }).format(rate.EarlyPaymentDeadlineDaysAbs)}{t('season-start-notice')}</div>
                  </>
                ) : null}
              </td>
            </tr>
          )
})}
        </tbody>
      </table>
    </TextPage>
  );
};

export default MembershipRates;
