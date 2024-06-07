import Container from "@/components/layouts/container";

const PostLayout = ({ children }: { children: React.ReactNode }) => (
  <Container>
    <article className="mb-32">{children}</article>
  </Container>
);

export default PostLayout;
