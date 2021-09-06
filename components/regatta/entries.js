import cn from "classnames";

function Entries({ children, table, categories }) {
  return (
    <div className="mx-auto prose" ƒ>
      <div dangerouslySetInnerHTML={{ __html: children }} />
      <figure>
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
                        entry == 1
                          ? "bg-red-500 text-white"
                          : entry == 2
                          ? "bg-green-500 text-white"
                          : entry == 3
                          ? "bg-blue-500 text-white"
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
        <figcaption>
          Wave matrix: entries are divided between waves 1, 2 and 3. Note that
          Adaptive, Para-rowing and Mixed Junior entries are not included in the
          scheme.
        </figcaption>
      </figure>
      {categories.map((category, index) => (
        <p
          className={cn(
            "flex flex-wrap gap-2 text-sm rounded-lg p-2",
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
      ))}
    </div>
  );
}

export default Entries;
