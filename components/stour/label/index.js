import cn from "classnames";

function Label({ children, as: Component, ...props }) {
  return (
    <Component
      className={cn(
        "text-sm font-medium tracking-widest text-gray-600 uppercase",
        props.className
      )}
    >
      {children}
    </Component>
  );
}

Label.defaultProps = {
  as: "span",
};

export default Label;
