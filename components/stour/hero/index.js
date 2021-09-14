import cn from "classnames";
import Container from "../../container";
import Label from "@/components/stour/label";

export function Hero(props) {
  const { title, label, description, dark, fullwidth } = props;
  function Text() {
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
  return fullwidth ? (
    <div className={cn(dark ? "text-white bg-blue-900" : "text-gray-900")}>
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

export default Hero;
