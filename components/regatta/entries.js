import cn from "classnames";

function Entries({ children, table, waveNames, caption }) {
  return (
    <div className="mx-auto">
      {children}
      <figure className="my-4 prose">
        <table>
          <thead>
            <tr>
              {table[0].map((entry, index) => (
                <th key={index} className="text-center">
                  {entry}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.slice(1).map((wave, index) => (
              <tr key={index}>
                <th key={index}>{wave[0]}</th>
                {wave.slice(1).map((entry, index) => (
                  <td
                    className="font-medium text-center numerals-lining"
                    key={index}
                  >
                    <div
                      className={cn(
                        entry == waveNames[0]
                          ? "bg-red-500 text-white"
                          : entry == waveNames[1]
                          ? "bg-green-500 text-white"
                          : entry == waveNames[2]
                          ? "bg-blue-500 text-white"
                          : entry == waveNames[3]
                          ? "bg-yellow-500 text-white"
                          : entry == waveNames[4]
                          ? "bg-purple-500 text-white"
                          : entry == waveNames[5]
                          ? "bg-pink-500 text-white"
                          : null,
                        "rounded-full"
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
      {/* {categories.map((category, index) => (
        <p
          className={cn(
            "flex flex-wrap gap-2 text-sm rounded p-2",
            index == 0
              ? "bg-red-500 text-white"
              : index == 1
              ? "bg-green-500 text-white"
              : index == 2
              ? "bg-blue-500 text-white"
              : null
          )}
          key={index}
        >
          <span className="font-bold">{category[0]}:</span>
          {category.slice(1).map((entry, index) => (
            <span className="px-1.5 text-sm border rounded-full" key={index}>
              {entry}
            </span>
          ))}
        </p>
      ))} */}
    </div>
  );
}

export default Entries;
