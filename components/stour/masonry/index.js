import cn from "classnames";
import { PropTypes } from "prop-types";

export function Masonry(props) {
  const { children, className } = props;
  return (
    <div
      className={cn(
        "box-border mx-auto md:masonry-2-col lg:masonry-3-col before:box-inherit after:box-inherit",
        className
      )}
    >
      {children}
    </div>
  );
}

Masonry.propTypes = {
  /**
   * Put all the elements inside. Tailwind classes `inline-block`, `overflow-hidden` and our custom `break-inside` may be neeced to keep the child elements in check.
   */
  children: PropTypes.any.isRequired,
};

export default Masonry;
