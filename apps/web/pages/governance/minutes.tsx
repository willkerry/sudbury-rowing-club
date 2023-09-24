import TextPage from "@/components/layouts/text-page";
import Button from "@/components/stour/button";
import Link from "@/components/stour/link";
import DateFormatter from "@/components/utils/date-formatter";
import { fetchMinutes } from "@sudburyrc/api";
import { InferGetStaticPropsType } from "next";

export const getStaticProps = async () => ({
  props: {
    minutes: await fetchMinutes(),
  },
});

const Minutes = ({
  minutes,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
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
            <td className="text-xs font-medium uppercase tracking-wider">
              <DateFormatter dateString={minute.date} />
            </td>
            <td className="capitalize text-gray-700">{minute.committee}</td>
            <td>
              {minute.public && minute.file ? (
                <Link href={minute.file} extension="PDF">
                  Download &darr;
                </Link>
              ) : (
                <span className="select-none text-gray-400">
                  Available on request
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </TextPage>
);

export default Minutes;
