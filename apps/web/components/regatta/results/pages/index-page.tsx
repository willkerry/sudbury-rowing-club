import Link from "next/link";
import { PageHead } from "@/components/regatta/results/page-head";
import { RaceRow, RaceTableHead } from "@/components/regatta/results/race-row";
import type { Division, IndexData, Wave } from "@/lib/regatta/results";

const divisionAnchor = (division: Division): string =>
  `division-${division.number}`;

const JumpNav = ({ waves }: { waves: Wave[] }) => {
  const divisions = waves.flatMap((wave) => wave.divisions);
  if (divisions.length === 0) return null;

  return (
    <nav
      aria-label="Jump to division"
      className="sticky top-0 z-10 border-gray-200 border-b bg-white/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-2">
        {divisions.map((division) => (
          <Link
            className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 text-xs hover:border-gray-400 hover:text-gray-900"
            href={`#${divisionAnchor(division)}`}
            key={division.number}
          >
            <span className="font-semibold">Div {division.number}</span>
            <span className="ml-1.5 font-mono text-gray-500">
              {division.time}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

const WaveHeading = ({ wave }: { wave: Wave }) => (
  <div className="mt-10 mb-3 flex items-center gap-3 border-gray-800 border-b-2 pb-2">
    <h2 className="font-semibold text-xl tracking-tight">Wave {wave.number}</h2>
    <span className="ml-auto font-medium font-mono text-gray-700 text-sm">
      {wave.time}
    </span>
  </div>
);

const DivisionBlock = ({ division }: { division: Division }) => (
  <section className="mt-6" id={divisionAnchor(division)}>
    <header className="flex items-center gap-3 border-gray-200 border-b pb-2">
      <span className="font-mono font-semibold text-gray-900 text-sm">
        {division.time}
      </span>
      <h3 className="font-semibold text-base">
        {division.href ? (
          <Link className="text-blue-600 hover:underline" href={division.href}>
            {division.name}
          </Link>
        ) : (
          division.name
        )}
      </h3>
      <span className="ml-auto text-gray-600 text-xs">
        {division.races.length} races
      </span>
    </header>

    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <RaceTableHead primaryLabel="#" secondaryLabel="Time" />
        <tbody>
          {division.races.map((race) => (
            <RaceRow key={race.raceNo} primary="race-no" race={race} />
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export const IndexPage = ({ data }: { data: IndexData }) => (
  <>
    <JumpNav waves={data.waves} />

    <PageHead
      eyebrow="Live timetable"
      sub={data.subtitle || undefined}
      title={data.title}
    />

    <div className="mx-auto max-w-7xl px-4 pb-12">
      {data.waves.map((wave) => (
        <section key={wave.number}>
          <WaveHeading wave={wave} />
          {wave.divisions.map((division) => (
            <DivisionBlock division={division} key={division.number} />
          ))}
        </section>
      ))}
    </div>
  </>
);
