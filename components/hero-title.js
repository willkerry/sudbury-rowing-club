import Container from "../components/container";
import cn from "classnames";

export default function HeroTitle({ title, children, prose }) {
  return (
    <div className="flex flex-wrap content-center h-48 bg-blue-800 border-t border-b text-blue-50">
      <Container>
        <div className={cn(prose && "max-w-prose mx-auto text-center")}>
          <h1 className="text-6xl font-bold tracking-tight">{title}</h1>
          {children}
        </div>
      </Container>
    </div>
  );
}
