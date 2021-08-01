import cn from "classnames";
import { PropTypes } from "prop-types";
import Container from "../../container";

export function Hero(props) {
  const { title, label, description, dark, fullwidth } = props;
  function Text() {
    return (
      <>
        {label && <p className="ml-0.5 tracking-widest uppercase">{label}</p>}
        <h2 className="pt-3 pb-6 font-serif text-4xl text-medium">{title}</h2>
        {description && <p className="font-medium opacity-80">{description}</p>}
      </>
    );
  }
  return fullwidth ? (
    <div className={cn(dark ? "text-white bg-blue-800" : "text-gray-900")}>
      <Container>
        <div className="flex flex-col h-96 justify-content-center max-w-prose">
          <div className="my-auto">
            <Text />
          </div>
        </div>
      </Container>
    </div>
  ) : (
    <Text />
  );
}

Hero.propTypes = {
  /**
   * What’s the big serif text in the middle.
   */
  title: PropTypes.string,
  /**
   * The more important uppercase text that appears at the top and summarise the whole shabbang.
   */
  label: PropTypes.string,
  /**
   * Subsidiary information, displayed in a very short paragraph belowed the title.
   */
  description: PropTypes.string,
  /**
   * Set to true in the hero is totally irrestricted by containers, i.e. if it’s full-width.
   */
  fullWidth: PropTypes.boolean,
  /**
   * Would you rather an Oxford Blue background?
   */
  dark: PropTypes.boolean,
};

export default Hero;
