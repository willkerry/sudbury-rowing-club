import Link from "@/components/stour/link";
import Image from "next/image";

const Section = (props) => <div {...props} className="" />;
const Table = (props) => (
  <table {...props} className="table w-full text-left border-collapse" />
);
const TableBody = (props) => <tbody {...props} className="align-baseline" />;
const Row = (props) => <tr {...props} className="h-16" />;
const LabelCell = (props) => (
  <td
    {...props}
    className="py-2 pr-2 font-medium text-gray-900 border-t border-gray-200 whitespace-nowrap"
  />
);
const Cell = (props, right) => (
  <td
    {...props}
    className="w-full py-2 pl-2 space-y-2 text-gray-600 border-t border-gray-200"
  />
);

function Results({ data, coursemap }) {
  return (
    <div className="grid gap-16 md:grid-cols-2">
      {data.map((item, index) => (
        <Section key={index}>
          <div className="text-center">
            <Image src={item.map} width={350} height={200} className="mx-auto" alt="" />
            <h4 className="pt-6 pb-1 text-xl font-bold">{item.title}</h4>
            <p className="pb-6 text-gray-500">{item.description}</p>
          </div>

          <Table>
            <TableBody>
              <Row>
                <LabelCell>Categories</LabelCell>
                <Cell>
                  {item.categories.map((item, index) => (
                    <span key={index}>{(index ? ", " : "") + item}</span>
                  ))}
                </Cell>
              </Row>
              <Row>
                <LabelCell>Gender</LabelCell>
                <Cell>
                  {item.gender.map((item, index) => (
                    <span key={index}>{(index ? ", " : "") + item}</span>
                  ))}
                </Cell>
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
              <Row>
                <LabelCell />
                <Cell>
                  <Link icon href={coursemap}>
                    View coursemap
                  </Link>
                </Cell>
              </Row>
            </TableBody>
          </Table>
        </Section>
      ))}
    </div>
  );
}

export default Results;
