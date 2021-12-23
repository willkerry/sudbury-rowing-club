import cn from "classnames";
import PropTypes from "prop-types";
import Container from "../../layouts/container";
import Label from "@/components/stour/label";

export function Hero({ title, label, description, dark, fullwidth }) {
  function text() {
    return (
      <>
        {label && <Label className="ml-1">{label}</Label>}
        <h2 className="pt-3 pb-6 text-4xl font-semibold tracking-tighter">
          {title}
        </h2>
        {description && (
          <div className="font-medium opacity-80">{description}</div>
        )}
      </>
    );
  }
  if (!fullwidth) {
    return text();
  }
  return (
    <div className={cn(dark ? "text-white bg-blue-900" : "text-gray-900")}>
      <Container>
        <div className="flex flex-col h-96 justify-content-center max-w-prose">
          <div className="my-auto">{text()}</div>
        </div>
      </Container>
    </div>
  );
}

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  dark: PropTypes.bool,
  fullwidth: PropTypes.bool,
};

Hero.defaultProps = {
  label: null,
  description: null,
  dark: false,
  fullwidth: false,
};

export default Hero;
