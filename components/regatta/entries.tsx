import cn from "classnames";

type Props = {
  children: React.ReactNode;
  table: string[][];
  waveNames: string[];
  caption: string;
};

const Entries = ({ children, table, waveNames, caption }: Props) => {
  const getWaveColor = (entry: string) => {
    switch (entry) {
      case waveNames[0]:
        return "bg-red-500";
      case waveNames[1]:
        return "bg-green-500";
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
      <figure className="my-4 prose">
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
    </div>
  );
};

export default Entries;
