import Container from "../components/container";
export default function HeroTitle({ title, children }) {
  return (
    <div className="flex flex-wrap content-center h-64 mb-16 text-white bg-sudbury-brand">
      <Container>
        <h1 className="text-4xl font-bold tracking-snug">{title}</h1>
      </Container>
    </div>
  );
}
