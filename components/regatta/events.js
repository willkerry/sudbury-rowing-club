import Label from "../stour/label";
import shortCourse from "@/components/regatta/events/350.svg";
import longCourse from "@/components/regatta/events/650.svg";
import Image from "next/image";

const Section = (props) => <section {...props} />;
const Table = (props) => <div {...props} className="w-full" />;
const TableBody = (props) => <dl {...props} />;
const Row = (props) => (
  <div {...props} className="flex flex-col py-2 border-t" />
);
const LabelCell = (props) => (
  <dd {...props}>
    <Label className="text-xs">{props.children}</Label>
  </dd>
);
const Cell = (props) => (
  <dl {...props} className="w-full text-sm font-medium text-gray-800" />
);

function Events({ data }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {data.map((item) => (
        <Section key={item._key}>
          <div className="text-center">
            {item.course === "350m" ? (
              <Image
                src={shortCourse}
                className="w-full px-4"
                alt="Illustrative map of the short regatta course. "
              />
            ) : (
              <Image
                src={longCourse}
                className="w-full px-4"
                alt="Illustrative map of the long regatta course. "
              />
            )}

            <h4 className="pt-6 pb-1 text-xl font-bold">{item.title}</h4>
            <p className="pb-6 text-sm text-gray-500 h-14">
              {item.description}
            </p>
          </div>

          <Table>
            <TableBody>
              <Row>
                <LabelCell>Categories</LabelCell>
                <Cell>{item.categories}</Cell>
              </Row>
              <Row>
                <LabelCell>Gender</LabelCell>
                <Cell>{item.gender}</Cell>
              </Row>
              <Row>
                <LabelCell>Boat Classes</LabelCell>
                <Cell>
                  {item.boatClasses.map((item, index) => (
                    <span key={index}>{(index ? ", " : "") + item}</span>
                  ))}
                </Cell>
              </Row>
              <Row>
                <LabelCell>Prizes</LabelCell>
                <Cell>{item.prizes}</Cell>
              </Row>
            </TableBody>
          </Table>
        </Section>
      ))}
    </div>
  );
}

export default Events;
