import type { Metadata, Viewport } from "next";
import "@fontsource-variable/jetbrains-mono/index.css";
import "@fontsource-variable/source-serif-4/opsz.css";
import "@fontsource-variable/source-serif-4/opsz-italic.css";
import "inter-ui/inter-variable.css";
import { Banner } from "@/components/banner";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { BASE_URL, HOME_OG_IMAGE_URL, PROJECT_NAME } from "@/lib/constants";
import "../styles/index.css";
import { blue } from "@sudburyrc/blue";
import localFont from "next/font/local";
import Providers from "./providers";

const digital7Font = localFont({
  display: "swap",
  src: "./Digital-7MonoItalic.woff2",
  variable: "--font-digital",
});

export const metadata: Metadata = {
  applicationName: "Sudbury Rowing Club",
  creator: PROJECT_NAME,
  manifest: "/favicon/site.webmanifest",
  metadataBase: new URL(BASE_URL),
  title: PROJECT_NAME,
  alternates: {
    canonical: BASE_URL,
  },

  icons: {
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/safari-pinned-tab.svg",
      },
    ],
  },
  openGraph: {
    countryName: "United Kingdom",
    locale: "en_GB",
    siteName: PROJECT_NAME,
    title: PROJECT_NAME,
    type: "website",

    images: [
      {
        url: HOME_OG_IMAGE_URL,
      },
    ],
  },
  other: {
    "msapplication-config": "/favicon/browserconfig.xml",
    "msapplication-TileColor": "#00295A",
  },
  twitter: {
    creator: PROJECT_NAME,
    title: PROJECT_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: "#fff", media: "(prefers-color-scheme: light)" },
    { color: blue[950], media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className={digital7Font.variable}>
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
