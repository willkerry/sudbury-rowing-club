import Container from "../components/container";
import cn from "classnames";

export default function HeroTitle({ title, children, prose }) {
  return (
    <div className="flex flex-wrap content-center pb-8 text-white h-36 bg-sudbury-brand">
      <Container>
        <div className={cn(prose && "max-w-prose mx-auto text-center")}>
          <h1 className="font-serif text-4xl">{title}</h1>
          {children}
        </div>
      </Container>
    </div>
  );
}
