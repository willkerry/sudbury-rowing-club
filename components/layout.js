import Alert from "../components/alert";
import Footer from "../components/footer";
import Meta from "../components/meta";
import Navbar from "../components/nav-bar/new-navbar";

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <Alert />
      <div className="min-h-screen">
        <Navbar />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
