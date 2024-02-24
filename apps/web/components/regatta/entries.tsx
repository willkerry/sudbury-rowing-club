import getBoatsByWave from "../utils/getBoatsByWave";

type Props = {
  children: React.ReactNode;
  table: string[][];
  waveNames: string[];
  caption?: string;
};

const WAVE_COLORS = [
  "bg-red-500 text-white",
  "bg-green-600 text-white",
  "bg-blue-500 text-white",
  "bg-yellow-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
];

const Entries = ({ children, table, waveNames, caption }: Props) => {
  const boatsByWave = getBoatsByWave(table, "Any");
  const getWaveColor = (entry: string) =>
    WAVE_COLORS[waveNames.indexOf(entry)] || "bg-gray-100";
  return (
    <div className="mx-auto">
      {children}
      <figure className="prose my-12 text-xs sm:text-sm lg:text-base">
        <table>
          <thead>
            <tr>
              {table[0].map((entry) => (
                <th key={entry} className="text-center">
                  {entry}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.slice(1).map((wave) => (
              <tr key={wave[0]}>
                <th>{wave[0]}</th>
                {wave.slice(1).map((entry) => (
                  <td key={entry} className="text-center">
                    <div
                      className={`rounded-lg px-0.5 font-medium ${getWaveColor(
                        entry,
                      )}
                      `}
                    >
                      {entry}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <figcaption>{caption}</figcaption>
      </figure>

      {Object.keys(boatsByWave).map((wave) => (
        <div className="text-sm" key={wave}>
          <h4 className="inline-block pr-2">Wave {wave}: </h4>
          {boatsByWave[wave].map((boat, i) => {
            const full = `${boat.x} ${boat.y}`;
            return (
              <span key={boat.x} className="inline-block pr-2">
                {full}
                {i < boatsByWave[wave].length - 1 && ", "}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Entries;
