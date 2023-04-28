import Footer from "@/components/footer";
import Meta from "@/components/layouts/meta";
import { Nav } from "@/components/nav";

type Props = {
  children: React.ReactNode;
};

/**
 * A zero-config layout component that renders page fluff. Use the `Meta` component
 * to override the default meta tags.
 */
const Layout: React.FC<Props> = ({ children }: Props) => (
  <>
    <Meta />
    <div className="min-h-screen">
      <Nav />
      <main>{children}</main>
    </div>
    <Footer />
  </>
);

export default Layout;
