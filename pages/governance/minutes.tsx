import TextPage from "@/components/layouts/text-page";
import Note from "@/components/stour/note";

const randomString = () => Math.random().toString(36).slice(2);

const Minutes = () => (
  <TextPage title="Minutes">
    <div className="relative rounded">
      <div className="absolute inset-0 flex items-center justify-center">
        <Note label="Committee minutes are no longer published here">
          Club members can access minutes on the myClubhouse platform. Other
          interested parties should contact the club secretary.
        </Note>
      </div>

      <table className="select-none blur">
        <thead>
          <tr>
            <th>Date</th>
            <th>Committee</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }, (_, i) => i).map((minute) => (
            <tr key={minute} className="hover:bg-gray-50">
              <td className="text-xs font-medium uppercase tracking-wider">
                {randomString()}
              </td>
              <td className="capitalize text-gray-700">{randomString()}</td>
              <td>Download</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </TextPage>
);

export default Minutes;
