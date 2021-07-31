import cn from "classnames";
import { PropTypes } from "prop-types";

const SIZE_MAPS = {
  small: "py-2 px-3 prose-sm my-5",
  large: "py-3 px-5 prose my-5",
};
const CENTERED_MAPS = {
  true: "mx-auto max-w-prose",
  false: "max-w-none",
};
const VARIANT_MAPS = {
  primary: "text-black",
  secondary: "text-gray-500",
  success: "text-green-700 border-green-500",
  error: "text-red-600 border-red-400",
  warning: "text-yellow-600 border-yellow-400",
};
export function Note(props) {
  const { children, type, size, label, centered } = props;
  return (
    <div
      className={cn(
        "border rounded-md max-w-prose prose",
        VARIANT_MAPS[type],
        SIZE_MAPS[size],
        CENTERED_MAPS[centered],
        props.className
      )}
    >
      {label && <span className="pr-1.5 font-semibold">{label}:</span>}

      {children}
    </div>
  );
}

Note.propTypes = {
  /**
   * What type of note are we dealing with?
   */
  type: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
  ]),
  /**
   * Do we want the default `large`, or a more compact `small` note?
   */
  size: PropTypes.oneOf(["small", "large"]),
  /**
   * Optionally, give the note a label.
   */
  label: PropTypes.string,
  /**
   * A nicer way to centre the element.
   */
  centered: PropTypes.bool,
};

Note.defaultProps = {
  type: "primary",
  size: "large",
  label: null,
  centered: false,
};

Note.type = VARIANT_MAPS;
Note.size = SIZE_MAPS;
Note.centered = CENTERED_MAPS;

export default Note;
