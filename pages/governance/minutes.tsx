import Link from "@/components/stour/link";
import TextPage from "@/components/layouts/text-page";
import { InferGetStaticPropsType, NextPage } from "next";
import fetchMinutes from "@/lib/queries/fetch-minutes";

export const getStaticProps = async () => {
  const minutes = await fetchMinutes();

  return { props: { minutes } };
};

const Minutes: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  minutes,
}) => (
  <TextPage title="Minutes">
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Committee</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {minutes.map((minute) => (
          <tr key={minute._id} className="hover:bg-gray-50">
            <td className="text-xs font-medium uppercase tracking-wider text-gray-600">
              {minute.date}
            </td>
            <td className="text-gray-700">{minute.committee}</td>
            <td>
              <Link href={minute.file} download>
                Download
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </TextPage>
);

export default Minutes;
