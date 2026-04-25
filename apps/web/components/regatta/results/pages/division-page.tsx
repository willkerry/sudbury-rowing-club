import { DivisionNav } from "@/components/regatta/results/division-nav";
import { PageHead } from "@/components/regatta/results/page-head";
import { RaceRow, RaceTableHead } from "@/components/regatta/results/race-row";
import type { DivisionData } from "@/lib/regatta/results";

export const DivisionPage = ({ data }: { data: DivisionData }) => (
  <>
    <DivisionNav items={data.nav} />

    <PageHead eyebrow={data.title} title={data.name} />

    <div className="mx-auto max-w-7xl px-4 pb-12">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <RaceTableHead primaryLabel="Time" secondaryLabel="Race" />
          <tbody>
            {data.races.map((race) => (
              <RaceRow key={race.raceNo} primary="time" race={race} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);
