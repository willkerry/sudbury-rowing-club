import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata, Viewport } from "next";
import "@fontsource-variable/jetbrains-mono/index.css";
import "@fontsource-variable/source-serif-4/opsz.css";
import "@fontsource-variable/source-serif-4/opsz-italic.css";
import "inter-ui/inter-variable.css";
import Banner from "@/components/banner";
import Footer from "@/components/footer";
import { Nav } from "@/components/nav";
import { BASE_URL, HOME_OG_IMAGE_URL, PROJECT_NAME } from "@/lib/constants";
import "../styles/index.css";
import { blue } from "@sudburyrc/blue";
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
  themeColor: [
    { color: "#fff", media: "(prefers-color-scheme: light)" },
    { color: blue[950], media: "(prefers-color-scheme: dark)" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <html lang="en-GB">
      <body>
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
    </NextIntlClientProvider>
  );
}
