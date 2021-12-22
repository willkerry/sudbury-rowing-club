import cn from "classnames";
import PropTypes from "prop-types";

function Label({ children, as: Component, className }) {
  return (
    <Component
      className={cn(
        "text-sm font-medium tracking-widest text-gray-600 uppercase",
        className
      )}
    >
      {children}
    </Component>
  );
}

Label.propTypes = {
  /**
   * The label text.
   * @type {string}
   * @required
   * @example
   * <Label>
   * Hello world!
   * </Label>
   */
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.string,
  ]).isRequired,
  /**
   * The component to render.
   * @type {node}
   * @default "span"
   * @example
   * <Label as="h1">
   * Hello world!
   * </Label>
   */
  as: PropTypes.node,
  /**
   * Add a class to the label.
   * @type {string}
   * @example
   * <Label className="my-class">
   * Hello world!
   * </Label>
   */
  className: PropTypes.string,
};

Label.defaultProps = {
  as: "span",
  className: "",
};

export default Label;
