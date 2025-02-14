import Banner from "@/components/banner";
import Footer from "@/components/footer";
import { Nav } from "@/components/nav";
import { BASE_URL, HOME_OG_IMAGE_URL, PROJECT_NAME } from "@/lib/constants";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "../styles/index.css";
import { blue } from "@sudburyrc/blue";
import Providers from "./providers";

const inter = Inter({
  axes: ["opsz"],
  display: "swap",
  style: ["italic", "normal"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetBrainsMono = JetBrains_Mono({
  display: "swap",
  style: ["italic", "normal"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const sourceSerif4 = Source_Serif_4({
  axes: ["opsz"],
  display: "swap",
  style: ["italic", "normal"],
  subsets: ["latin"],
  variable: "--font-source-serif-4",
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${jetBrainsMono.variable} ${sourceSerif4.variable}`}
    >
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
  );
}
