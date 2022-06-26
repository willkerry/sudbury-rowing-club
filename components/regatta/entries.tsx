import cn from "classnames";
import getBoatsByWave from "../utils/getBoatsByWave";

type Props = {
  children: React.ReactNode;
  table: string[][];
  waveNames: string[];
  caption?: string;
};

const Entries = ({ children, table, waveNames, caption }: Props) => {
  const boatsByWave = getBoatsByWave(table, "Any");
  const getWaveColor = (entry: string) => {
    switch (entry) {
      case waveNames[0]:
        return "bg-red-500 text-white";
      case waveNames[1]:
        return "bg-green-600 text-white";
      case waveNames[2]:
        return "bg-blue-500 text-white";
      case waveNames[3]:
        return "bg-yellow-500 text-white";
      case waveNames[4]:
        return "bg-purple-500 text-white";
      case waveNames[5]:
        return "bg-pink-500 text-white";
      default:
        return "bg-gray-100";
    }
  };
  return (
    <div className="mx-auto">
      {children}
      <figure className="my-12 text-xs prose sm:text-sm lg:text-base">
        <table>
          <thead>
            <tr>
              {table[0].map((entry, i) => (
                <th key={i} className="text-center">
                  {entry}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.slice(1).map((wave) => (
              <tr key={wave[0]}>
                <th>{wave[0]}</th>
                {wave.slice(1).map((entry, i) => (
                  <td
                    key={i}
                    className="text-center"
                  >
                    <div
                      className={`font-medium rounded-lg px-0.5 ${getWaveColor(entry)}
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
              <span key={i} className="inline-block pr-2">
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
