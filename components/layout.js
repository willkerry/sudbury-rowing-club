import Alert from "../components/alert";
import Footer from "../components/footer";
import Meta from "../components/meta";
import NavBar from "../components/nav-bar/";

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />

      <div className="min-h-screen">
        <NavBar />
        {/* <Alert preview={preview} /> */}
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
