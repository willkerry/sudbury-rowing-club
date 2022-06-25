import cn from "classnames";
import getBoatsByWave from "../utils/getBoatsByWave";

type Props = {
  children: React.ReactNode;
  table: string[][];
  waveNames: string[];
  caption: string;
};

const Entries = ({ children, table, waveNames, caption }: Props) => {
  const boatsByWave = getBoatsByWave(table, "Any");
  const getWaveColor = (entry: string) => {
    switch (entry) {
      case waveNames[0]:
        return "bg-red-500";
      case waveNames[1]:
        return "bg-green-600";
      case waveNames[2]:
        return "bg-blue-500";
      case waveNames[3]:
        return "bg-yellow-500";
      case waveNames[4]:
        return "bg-purple-500";
      case waveNames[5]:
        return "bg-pink-500";
      default:
        return "bg-gray-400";
    }
  };
  return (
    <div className="mx-auto">
      {children}
      <figure className="my-4 text-xs prose sm:text-sm lg:text-base">
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
                    className="font-medium text-center numerals-lining"
                  >
                    <div
                      className={cn(
                        "text-white rounded-full",
                        getWaveColor(entry)
                      )}
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

      <div className="space-y-4">
        {
          // Iterate over the boatsByWave object and display the boats in each wave
          Object.keys(boatsByWave).map((wave) => (
            <div className="space-x-4" key={wave}>
              <strong className="text-center">Wave {wave}:</strong>
              {boatsByWave[wave].map((boat) => {
                const full = `${boat.x} ${boat.y}`;
                return (
                  <span
                    className={`inline-block px-2 text-xs sm:text-sm lg:text-base text-white font-medium rounded-full ${getWaveColor(wave)}`}
                    key={full}
                  >
                    {full}
                  </span>
                );
              })}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Entries;

// function getBoatsByWave(table: string[][]) {
//   const categories = table.map((value) => value[0]);
//   const output: string[][] = [];
//   table.map(function (row, x) {
//     if (!x) return; // skip header row
//     row.map(function (value, y) {
//       if (!y || !parseInt(value)) return; // skip category column and non-numeric values
//       const fullName = `${categories[x]} ${table[0][y]}`;
//       const waveIndex = parseInt(value) - 1;
//       if (output[waveIndex]) {
//         output[waveIndex].push(fullName);
//       } else {
//         output[waveIndex] = [fullName];
//       }
//     });
//   });
//   return output;
// }
