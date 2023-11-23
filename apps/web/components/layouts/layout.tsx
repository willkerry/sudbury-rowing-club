import Footer from "@/components/footer";
import Meta from "@/components/layouts/meta";
import { Nav } from "@/components/nav";
import Banner from "@/components/banner";

type Props = {
  children: React.ReactNode;
};

/**
 * A zero-config layout component that renders page fluff. Use the `Meta` component
 * to override the default meta tags.
 */
const Layout = ({ children }: Props) => (
  <>
    <Meta />
    <div className="min-h-screen">
      <Banner />
      <Nav />
      <main>{children}</main>
    </div>
    <Footer />
  </>
);

export default Layout;
