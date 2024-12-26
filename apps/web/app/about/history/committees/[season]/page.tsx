import TextPage from "@/components/layouts/text-page";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import committees from "@/data/officer-archive.json";
import { createMetadata } from "@/lib/create-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listify } from "radash";
import { POSITION_NAMES, initialiseName } from "../page";

const NAME_CHANGE_YEAR = 1982;

const getClubName = (year: number | string) => {
  const yearNumber = Number(year);
  if (Number.isNaN(yearNumber) || yearNumber > NAME_CHANGE_YEAR) return "SRC";

  return "SBC";
};

export const generateStaticParams = async () =>
  committees.map((committee) => ({
    season: committee.season[0],
  }));

type Params = Awaited<ReturnType<typeof generateStaticParams>>[number];

export const generateMetadata = async ({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> => {
  const { season } = await params;

  const committee = committees.find(
    (committee) => committee.season[0] === season,
  );

  if (!committee) return {};

  return createMetadata({
    title: `The ${season} ${getClubName(season)} Committee`,
    description: `${season} Committee`,
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

  const committee = committees.find(
    (committee) => committee.season[0] === season,
  );

  if (!committee) return notFound();

  const pageTitle = `${season} ${getClubName(season)} Committee`;

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
          {listify(committee, (role, incumbents) => {
            if (!incumbents?.length) return null;
            if (role === "season") return null;

            const isMultiple = incumbents.length > 1;

            const roleName = POSITION_NAMES.get(role)?.[isMultiple ? 1 : 0];

            return (
              <tr>
                <th>{roleName}</th>
                <td>
                  {incumbents?.map((name, i) => (
                    <InitialisedName name={name} key={name} />
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TextPage>
  );
};

export default Committee;
