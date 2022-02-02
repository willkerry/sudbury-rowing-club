import PropTypes from "prop-types";
import cn from "classnames";

export default function Center({ h, v, children, className }) {
  const classes = cn(
    "flex flex-col justify-center items-center",
    h && `h-full`,
    v && `v-full`,
    className
  );
  return <div className={classes}>{children}</div>;
}

Center.propTypes = {
  /**
   * Center horizontally?
   * @default true
   * @type {boolean}
   * @memberof Center
   * @public
   * @example
   * <Center h={false}>
   *    <div>
   *      <h1>Hello</h1>
   *   </div>
   * </Center>
   */
  h: PropTypes.bool,
  /**
   * Center vertically?
   * @default false
   * @type {boolean}
   * @memberof Center
   * @public
   * @example
   * <Center v={true}>
   *   <div>
   *    <h1>Hello</h1>
   *  </div>
   * </Center>
   */
  v: PropTypes.bool,
  /**
   * Children
   * @type {React.ReactNode}
   * @memberof Center
   */
  children: PropTypes.node,
  /**
   * Additional class names
   * @type {string}
   * @memberof Center
   */
  className: PropTypes.string,
};

Center.defaultProps = {
  h: true,
  v: false,
  children: null,
  className: null,
};
