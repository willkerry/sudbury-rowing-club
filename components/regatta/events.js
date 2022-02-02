import Image from "next/image";
import PropTypes from "prop-types";
import shortCourse from "@/components/regatta/events/350.svg";
import longCourse from "@/components/regatta/events/650.svg";
import Label from "../stour/label";

function Table({ children }) {
  return <div className="w-full">{children}</div>;
}

Table.propTypes = {
  children: PropTypes.node.isRequired,
};

function TableBody({ children }) {
  return <dl>{children}</dl>;
}

TableBody.propTypes = {
  children: PropTypes.node.isRequired,
};

function Row({ children }) {
  return <div className="flex flex-col py-2 border-t">{children}</div>;
}

Row.propTypes = {
  children: PropTypes.node.isRequired,
};

function LabelCell({ children }) {
  return (
    <dd>
      <Label className="text-xs">{children}</Label>
    </dd>
  );
}

LabelCell.propTypes = {
  children: PropTypes.node.isRequired,
};

function Cell({ children }) {
  return (
    <dl className="w-full text-sm font-medium text-gray-800">{children}</dl>
  );
}

Cell.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Events({ data }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {data.map((item) => (
        <section key={item._key}>
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
                  {item.boatClasses.map((w, index) => (
                    <span key={w}>{(index ? ", " : "") + w}</span>
                  ))}
                </Cell>
              </Row>
              <Row>
                <LabelCell>Prizes</LabelCell>
                <Cell>{item.prizes}</Cell>
              </Row>
            </TableBody>
          </Table>
        </section>
      ))}
    </div>
  );
}

Events.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _key: PropTypes.string.isRequired,
      course: PropTypes.string.isRequired,
      categories: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      boatClasses: PropTypes.arrayOf(PropTypes.string).isRequired,
      prizes: PropTypes.string.isRequired,
    })
  ),
};
Events.defaultProps = {
  data: [],
};
