import TextPage from "@/components/layouts/text-page";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createMetadata } from "@/lib/create-metadata";
import { getCommitteeArchive } from "@/lib/get-committee-archive";
import { initialiseName } from "@/lib/helpers/initialiseName";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listify } from "radash";

const committeeArchive = getCommitteeArchive();

const NAME_CHANGE_YEAR = 1982;

const getClubName = (year: number | string) => {
  const yearNumber = Number(year);
  if (Number.isNaN(yearNumber) || yearNumber > NAME_CHANGE_YEAR)
    return ["SRC", "Sudbury Rowing Club"];

  return ["SBC", "Stour Boat Club"];
};

export const generateStaticParams = async () =>
  committeeArchive.map(({ season }) => ({
    season,
  }));

type Params = Awaited<ReturnType<typeof generateStaticParams>>[number];

export const generateMetadata = async ({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> => {
  const { season } = await params;

  const committee = committeeArchive.find(
    (committee) => committee.season === season,
  );

  if (!committee) return {};

  const clubName = getClubName(season);

  return createMetadata({
    title: `The ${season} ${clubName[0]} Committee`,
    description: `${clubName[1]} committee of ${season}`,
  });
};

const InitialisedName = ({ name }: { name: string }) => {
  const initialisedName = initialiseName(name);

  if (initialisedName === name) return <div>{name}</div>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="block">{initialisedName}</TooltipTrigger>
        <TooltipContent>{name.replace("+", " ")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Committee = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { season } = await params;

  const committee = committeeArchive.find(
    (committee) => committee.season === season,
  );

  if (!committee) return notFound();

  const clubName = getClubName(season);
  const pageTitle = `${season} ${clubName[0]} Committee`;

  return (
    <TextPage title={pageTitle} color="transparent">
      <table>
        <thead>
          <tr>
            <th className="sr-only">Role</th>
            <th>Incumbent(s)</th>
          </tr>
        </thead>
        <tbody>
          {listify(committee.committee, (key, office) => (
            <tr key={key}>
              <th>{office?.displayName}</th>
              <td>
                {office?.holders?.map((name) => (
                  <InitialisedName name={name} key={name} />
                ))}
              </td>
            </tr>
          ))}
        </tbody>

        <caption className="mt-6 caption-bottom text-gray-500">
          {clubName[1]} committee of {season}
        </caption>
      </table>
    </TextPage>
  );
};

export default Committee;
