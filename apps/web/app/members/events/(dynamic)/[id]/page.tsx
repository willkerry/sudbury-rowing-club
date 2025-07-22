import { serversideFetchCompetitions } from "@sudburyrc/api";
import { slug } from "github-slugger";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBladeUrls } from "@/app/regatta/records/[event]/utils";
import TextPage from "@/components/layouts/text-page";
import { Link as StourLink } from "@/components/stour/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DateFormatter } from "@/components/utils/date-formatter";
import { getClubByUrl } from "@/lib/getClub";
import { cloudflareLoader } from "@/lib/loaders/cloudflare-loader";

export const revalidate = 86_400;

type EventPageParams = { id: string };
type EventPageParamObject = { params: Promise<EventPageParams> };

export async function generateStaticParams(): Promise<EventPageParams[]> {
  const events = await serversideFetchCompetitions(false);

  return events.map((event) => ({ id: slug(event.id) }));
}

const Calendar = async ({ params }: EventPageParamObject) => {
  const { id } = await params;

  const event = (await serversideFetchCompetitions(false)).find(
    (event) => slug(event.id) === id,
  );

  const club = await getClubByUrl(event?.url || "");

  if (!event) return notFound();

  return (
    <TextPage title={event?.competition}>
      <div className="sm:hidden" />

      {club?.id === 465 && (
        <Alert variant="warn">
          <AlertTitle>
            This is <em>our</em> event.
          </AlertTitle>
          <AlertDescription>
            There’s much more information in the{" "}
            <Link href="../../regatta">dedicated regatta section</Link>.
          </AlertDescription>
        </Alert>
      )}

      <table>
        <tbody>
          {club && (
            <tr>
              <th>Club</th>
              <td>
                <div className="flex items-center gap-2">
                  <Image
                    src={getBladeUrls(club?.code, false)[0]}
                    alt={club?.name}
                    width={32}
                    height={16}
                    loading="lazy"
                    loader={cloudflareLoader}
                    className="m-0!"
                  />
                  {club?.name}
                </div>
              </td>
            </tr>
          )}

          <tr>
            <th>Date</th>
            <td>
              <DateFormatter dateString={event?.startDate} format="long" />
            </td>
          </tr>

          <tr>
            <th>Region</th>
            <td>{event?.region}</td>
          </tr>

          <tr>
            <th>Notes</th>
            <td>{event?.notes}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex flex-col flex-wrap gap-x-4 gap-y-2 font-medium text-sm sm:flex-row">
        <StourLink href={event?.url || ""} external>
          Event website
        </StourLink>

        {club?.href && (
          <StourLink href={club?.href} external>
            Club information
          </StourLink>
        )}

        {club?.website && (
          <StourLink href={club?.website} external>
            Club website
          </StourLink>
        )}
      </div>
    </TextPage>
  );
};

export default Calendar;
