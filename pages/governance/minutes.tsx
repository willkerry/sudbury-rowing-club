import sanityClient from "@/lib/sanity.server";
import groq from "groq";
import Link from "@/components/stour/link";
import TextPage from "@/components/layouts/text-page";
import { Download } from "react-feather";

type MinuteType = {
  _id: string;
  committee: string;
  date: string;
  file: string;
};
type Props = {
  minutes: MinuteType[];
};

const Minutes = ({ minutes }: Props) => (
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
            <td className="text-xs font-medium tracking-wider text-gray-600 uppercase">
              {minute.date}
            </td>
            <td className="text-gray-700">{minute.committee}</td>
            <td>
              <Link href={minute.file}>
                Download
                <Download size="1em" className="inline-flex mb-0.5 ml-1" />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </TextPage>
);

export default Minutes;

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`*[_type == "minutes" && !(_id in path("drafts.**"))] | order(date desc)
    {
      _id,
      date,
      "file": file.asset->url,
      "committee": committee->title
    }`
  );
  const minutes = data.map((item: any) => {
    return {
      ...item,
      date: new Date(item.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  });
  return {
    props: { minutes },
  };
};
