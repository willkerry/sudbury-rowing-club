import { Container } from "@/components/layouts/container";

const PostLayout = ({ children }: { children: React.ReactNode }) => (
  <Container>
    <article className="pb-16">{children}</article>
  </Container>
);

export default PostLayout;
