import Footer from "@/components/footer";
import Meta from "@/components/layouts/meta";
import Nav from "@/components/nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Meta />
      <body className="min-h-screen">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
