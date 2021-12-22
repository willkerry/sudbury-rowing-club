import cn from "classnames";
import PropTypes from "prop-types";

function Entries({ children, table, waveNames, caption }) {
  const getWaveColor = (entry) => {
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
                {wave.slice(1).map((entry, index) => (
                  <td
                    className="font-medium text-center numerals-lining"
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
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
}

Entries.propTypes = {
  /**
   * The table to display.
   */
  table: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  /**
   * The wave names to display.
   */
  waveNames: PropTypes.arrayOf(PropTypes.string),
  /**
   * The caption to display.
   */
  caption: PropTypes.string,
  /**
   * The children (i.e. typically the blurb up top) to display.
   */
  children: PropTypes.node,
};

Entries.defaultProps = {
  table: [],
  waveNames: [],
  caption: "",
  children: null,
};

export default Entries;
