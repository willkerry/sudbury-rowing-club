import cn from "classnames";
import PropTypes from "prop-types";

export default function Container({ children, className }) {
  return (
    <div className={cn("container max-w-screen-lg mx-auto px-5", className)}>
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Container.defaultProps = {
  children: null,
  className: null,
};
