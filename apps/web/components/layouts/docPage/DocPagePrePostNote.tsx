export type PrePostNote =
  | string
  | {
      value: string;
      label: string;
      url?: string | undefined;
    };

export const DocPagePrePostNote = ({
  notes,
}: {
  notes?: PrePostNote[];
}) => (
  <table className="opacity-90">
    <colgroup>
      <col />
      <col className="w-full" />
    </colgroup>

    <tbody>
      {notes?.map((note, i) => {
        if (!note) return null;

        if (typeof note === "string") {
          return (
            <tr className="" key={i}>
              <td colSpan={2} className="">
                {note}
              </td>
            </tr>
          );
        }

        return (
          <tr className="" key={i}>
            <th scope="row" key={i} className="">
              {note.label}
            </th>
            <td className="" key={i}>
              {note.value}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
