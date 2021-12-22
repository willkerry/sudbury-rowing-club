import cn from "classnames";
import PropTypes from "prop-types";
import Link from "@/components/stour/link";

function CompetitorInformation({ tab, description, items }) {
  return (
    <div className={cn(tab && "mx-auto", "prose")}>
      {description}
      <div className="py-6 prose">
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              <Link
                href={`${item.url}?dl=`}
                download
                aria-label={`Download ${item.title}`}
                extension={item.extension}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

CompetitorInformation.propTypes = {
  tab: PropTypes.bool,
  description: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      extension: PropTypes.string.isRequired,
    })
  ),
};

CompetitorInformation.defaultProps = {
  tab: false,
  description: "",
  items: [],
};

export default CompetitorInformation;
