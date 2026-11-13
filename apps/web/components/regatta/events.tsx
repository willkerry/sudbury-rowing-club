import {
  CourseFigure,
  CourseModelDefs,
} from "@/components/regatta/course-model/figure";
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
    <dt>
      <Label className="text-xs">{label}</Label>
    </dt>
    <dd className="w-full text-sm font-medium text-gray-800">{value}</dd>
  </div>
);

export const Events = ({ data }: { data: Event[] }) => (
  <div className="grid gap-16">
    <CourseModelDefs />
    {data.map((item, index) => (
      <section key={item._key}>
        <CourseFigure
          fig={`Fig ${index + 1}`}
          id={item.course === "350m" ? "350m" : "650m"}
        />
        <h4 className="pt-6 pb-1 text-xl font-bold">{item.title}</h4>
        <p className="pb-4 text-sm text-gray-500">{item.description}</p>
        <dl className="grid gap-x-8 sm:grid-cols-2">
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
