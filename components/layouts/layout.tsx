import Footer from "@/components/footer";
import Meta from "@/components/layouts/meta";
import Navbar from "@/components/nav-bar/new-navbar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => (
  <>
    <Meta />
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
    <Footer />
  </>
);

export default Layout;
