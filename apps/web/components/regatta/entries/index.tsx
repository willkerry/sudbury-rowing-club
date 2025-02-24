import { cn } from "@/lib/utils";
import getBoatsByWave from "../../utils/getBoatsByWave";
import { Chip } from "./chip";

type Props = {
  children: React.ReactNode;
  table: string[][];
  waveNames: string[];
  caption?: string;
  compact?: boolean;
};

const WAVE_COLORS = [
  "bg-red-500 text-white",
  "bg-green-600 text-white",
  "bg-blue-500 text-white",
  "bg-yellow-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
];

const listFormatter = new Intl.ListFormat("en-GB");

const Entries = ({ children, table, waveNames, caption, compact }: Props) => {
  const boatsByWave = getBoatsByWave(table, "Any");
  const getWaveColor = (entry: string) =>
    WAVE_COLORS[waveNames.indexOf(entry)] || "bg-gray-100";

  const indicesToBoatName = (categoryIndex: number, boatClassIndex: number) =>
    `${table[categoryIndex + 1][0]} ${table[0][boatClassIndex + 1]}`;

  return (
    <div className="mx-auto">
      {children}
      <figure
        className={cn(
          "prose",
          "overflow-x-auto",
          compact ? "prose-sm my-6" : "my-12 text-xs sm:text-sm lg:text-base",
        )}
      >
        <table>
          <thead>
            <tr>
              {table[0].map((entry) => (
                <th key={entry} className="px-pt text-center sm:px-1">
                  {entry}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.slice(1).map((wave, category) => (
              <tr key={`${wave[0]}-${category}`}>
                <th>{wave[0]}</th>
                {wave.slice(1).map((entry, boatClass) => {
                  if (!entry) return <td key={`${entry}-${boatClass}`} />;

                  return (
                    <td
                      key={`${entry}-${boatClass}`}
                      className="px-0.5 text-center sm:px-1"
                    >
                      <Chip
                        id={indicesToBoatName(category, boatClass)}
                        location="table"
                        className="w-full"
                        color={getWaveColor(entry)}
                      >
                        {entry}
                      </Chip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <figcaption>{caption}</figcaption>
      </figure>

      {Object.keys(boatsByWave).map((wave) => (
        <div className="prose prose-sm text-sm" key={wave}>
          <h4 className="mb-0 inline-block pr-2">Wave {wave}: </h4>

          {listFormatter
            .formatToParts(boatsByWave[wave].map(({ x, y }) => `${x} ${y}`))
            .map(({ type, value }, i) => {
              if (type === "literal") return <span key={i}>{value}</span>;

              return (
                <Chip
                  id={value}
                  location="list"
                  color={getWaveColor(wave)}
                  key={value}
                  className="px-1 text-xs"
                >
                  {value}
                </Chip>
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default Entries;
