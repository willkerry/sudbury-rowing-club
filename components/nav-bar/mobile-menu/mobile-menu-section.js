import cn from "classnames";
import PropTypes from "prop-types";
import randomUUID from "crypto";
import { CompactMobileMenuItem, MobileMenuItem } from "./mobile-menu-item";

export default function MobileMenuSection({ title, data, compact }) {
  return (
    <div className="px-5 pt-4 pb-6">
      <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {title}
      </div>
      <div className="mt-3">
        <nav
          className={cn(
            "grid grid-cols-2 sm:grid-cols-6 gap-x-6",
            compact ? "gap-y-2" : "gap-y-4"
          )}
        >
          {compact
            ? data.map((a) => (
                <CompactMobileMenuItem
                  data={a}
                  key={randomUUID.randomBytes(4).toString("hex")}
                />
              ))
            : data.map((a) => (
                <MobileMenuItem
                  data={a}
                  key={randomUUID.randomBytes(4).toString("hex")}
                />
              ))}
        </nav>
      </div>
    </div>
  );
}
MobileMenuSection.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      shortName: PropTypes.string,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  compact: PropTypes.bool,
};
MobileMenuSection.defaultProps = {
  compact: false,
};
