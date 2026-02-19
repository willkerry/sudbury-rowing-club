export type PrePostNote =
  | string
  | {
      value: string;
      label: string;
      url?: string | undefined;
    };

export const DocPagePrePostNote = ({ notes }: { notes?: PrePostNote[] }) => (
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
            <tr key={i}>
              <td colSpan={2}>{note}</td>
            </tr>
          );
        }

        return (
          <tr key={i}>
            <th scope="row">{note.label}</th>
            <td>{note.value}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
