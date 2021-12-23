import PropTypes from "prop-types";
import Footer from "@/components/footer";
import Meta from "@/components/layouts/meta";
import Navbar from "@/components/nav-bar/new-navbar";

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Navbar />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
