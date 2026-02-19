import Image from "next/image";
import shortCourse from "@/components/regatta/events/350.svg";
import longCourse from "@/components/regatta/events/650.svg";
import { Label } from "@/components/stour/label";

type Event = {
  _key: string;
  title: string;
  description: string;
  course: string;
  categories: string;
  gender: string;
  boatClasses: string[];
  prizes: string;
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col border-t py-2">
    <dd>
      <Label className="text-xs">{label}</Label>
    </dd>
    <dl className="w-full font-medium text-gray-800 text-sm">{value}</dl>
  </div>
);

export const Events = ({ data }: { data: Event[] }) => (
  <div className="grid gap-8 md:grid-cols-2">
    {data.map((item) => (
      <section key={item._key}>
        <div className="text-center">
          <Image
            alt={`Illustrative map of the ${
              item.course === "350m" ? "short" : "long"
            } regatta course.`}
            className="w-full px-4"
            src={item.course === "350m" ? shortCourse : longCourse}
          />
          <h4 className="pt-6 pb-1 font-bold text-xl">{item.title}</h4>
          <p className="h-14 pb-6 text-gray-500 text-sm">{item.description}</p>
        </div>
        <div className="w-full">
          <dl>
            <Row label="Categories" value={item.categories} />
            <Row label="Gender" value={item.gender} />
            <Row
              label="Boat Classes"
              value={item.boatClasses.map((w, index) => (
                <span className="disambiguate" key={w}>
                  {(index ? ", " : "") + w}
                </span>
              ))}
            />
            <Row label="Prizes" value={item.prizes} />
          </dl>
        </div>
      </section>
    ))}
  </div>
);

export const CompactEvents = ({ data }: { data: Event[] }) => (
  <table>
    <thead>
      <tr>
        <th>Event</th>
        <th>Categories</th>
        <th>Boat Classes</th>
        <th>Prizes</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item._key}>
          <td className="font-bold">{item.course}</td>
          <td>{item.categories}</td>
          <td>
            {item.boatClasses.map((w, index) => (
              <span key={w}>{(index ? ", " : "") + w}</span>
            ))}
          </td>
          <td>{item.prizes}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
