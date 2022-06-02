import Footer from "@/components/footer";
import Meta from "@/components/layouts/meta";
import Nav from "@/components/nav";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => (
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
