import { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/jetbrains-mono/index.css";
import "inter-ui/inter-variable.css";
import { BASE_URL, HOME_OG_IMAGE_URL, PROJECT_NAME } from "@/lib/constants";
import Banner from "@/components/banner";
import Footer from "@/components/footer";
import { Nav } from "@/components/nav";
import "../styles/index.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: PROJECT_NAME,
  creator: PROJECT_NAME,
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: PROJECT_NAME,
    type: "website",
    siteName: PROJECT_NAME,
    countryName: "United Kingdom",
    locale: "en_GB",

    images: [
      {
        url: HOME_OG_IMAGE_URL,
      },
    ],
  },
  twitter: {
    title: PROJECT_NAME,
    creator: PROJECT_NAME,
  },
  metadataBase: new URL(BASE_URL),

  applicationName: "Sudbury Rowing Club",
  manifest: "/favicon/site.webmanifest",
  other: {
    "msapplication-TileColor": "#00295A",
    "msapplication-config": "/favicon/browserconfig.xml",
  },
  icons: {
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/safari-pinned-tab.svg",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>
        <Script
          defer
          data-domain="sudburyrowingclub.org.uk"
          src="https://analytics.sudburyrowingclub.org.uk/js/script.js"
        />
        <Providers>
          <main>
            <Banner />
            <Nav />

            <div className="min-h-screen">{children}</div>

            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
