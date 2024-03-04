import { cn } from "@/lib/utils";
import getBoatsByWave from "../utils/getBoatsByWave";

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

const BOAT_CLASS_SYMBOLS: Record<string, string> = {
  "×": "scull",
  "+": "coxed",
  "−": "coxless",
  "/": "or",
  " ": "-",
};

const sanitizeBoatClass = (boatClass: string) =>
  boatClass
    .split("")
    .map((char) => BOAT_CLASS_SYMBOLS[char] || char)
    .join("")
    .concat("_only");

const getElementsByBoatName = (boatName: string) =>
  document.querySelectorAll(`[data-boatid^="${boatName}"]`);

const highlightBoat = (boatName: string) => {
  const boatElements = getElementsByBoatName(boatName);

  boatElements.forEach((boatElement) => {
    boatElement.classList.add("ring-2");
  });
};

const unhighlightBoat = (boatName: string) => {
  const boatElements = getElementsByBoatName(boatName);

  boatElements.forEach((boatElement) => {
    boatElement.classList.remove("ring-2");
  });
};

const Chip = ({
  children,
  color,
  id,
  className,
}: {
  children: React.ReactNode;
  location: "table" | "list";
  color: string;
  id: string;
  className?: string;
}) => {
  const sanitisedId = sanitizeBoatClass(id);

  return (
    <button
      data-boatid={sanitisedId}
      type="button"
      className={cn(
        "rounded px-0.5 font-medium ring-black ring-offset-1 transition",
        color,
        className,
      )}
      onMouseEnter={() => highlightBoat(sanitisedId)}
      onMouseLeave={() => unhighlightBoat(sanitisedId)}
      onFocus={() => highlightBoat(sanitisedId)}
      onBlur={() => unhighlightBoat(sanitisedId)}
      onClick={() => highlightBoat(sanitisedId)}
    >
      {children}
    </button>
  );
};

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
              <tr key={wave[0]}>
                <th>{wave[0]}</th>
                {wave.slice(1).map((entry, boatClass) => {
                  if (!entry) return <td key={entry} />;

                  return (
                    <td key={entry} className="px-0.5 text-center sm:px-1">
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

          {boatsByWave[wave].map((boat, i) => {
            const full = `${boat.x} ${boat.y}`;
            const isLast = i === boatsByWave[wave].length - 1;

            return (
              <>
                <Chip
                  id={full}
                  location="list"
                  color={getWaveColor(wave)}
                  key={full}
                  className={cn("px-1 text-xs", isLast && "mb-2")}
                >
                  {full}
                </Chip>

                {!isLast && ", "}
              </>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Entries;
