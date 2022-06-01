import TextPage from "@/components/layouts/text-page";
import Logo from "@/components/logo";
import Crest from "@/components/logo/crest";
import Social from "@/components/logo/social";
import Link from "@/components/stour/link";
import combineURLs from "@/lib/helpers/combineURLs";
import Color from "color";
import { GetStaticProps } from "next";
import NextLink from "next/link";
import { Circle, HelpCircle } from "react-feather";
import tailwindConfig from "../../tailwind.config.js";

const brandAssets = [
  {
    name: "Primary",
    description: "Crest in Oxford Blue",
    Illustration: Crest,
    color: "#002147",
    files: [
      {
        w: "",
        href: "/assets/about/brand/primary/primary.svg",
      },
      {
        w: "",
        href: "/assets/about/brand/primary/primary.pdf",
      },
      {
        w: "1280",
        href: "/assets/about/brand/primary/primary@1280w.png",
      },
      {
        w: "640",
        href: "/assets/about/brand/primary/primary@640w.png",
      },
    ],
  },
  {
    name: "White",
    description: "Crest in white",
    Illustration: Crest,
    color: "#FFF",
    files: [
      {
        w: "",
        href: "/assets/about/brand/white/white.svg",
      },
      {
        w: "",
        href: "/assets/about/brand/white/white.pdf",
      },
      {
        w: "1280",
        href: "/assets/about/brand/white/white@1280w.png",
      },
      {
        w: "640",
        href: "/assets/about/brand/white/white@640w.png",
      },
    ],
  },
  {
    name: "Primary with text",
    description: "A composited logo that contains both crest and wordmark.",
    Illustration: Logo,
    color: "#002147",
    files: [
      {
        format: "SVG",
        w: "",
        href: "/",
      },
      {
        format: "PDF",
        w: "",
        href: "/",
      },
      {
        format: "PNG",
        w: "1280",
        href: "/",
      },
      {
        format: "PNG",
        w: "640",
        href: "/",
      },
    ],
  },
  {
    name: "Social",
    description:
      "A square image with a background, for use on platforms that require profile pictures.",
    Illustration: Social,
    color: "#003B80",
    files: [
      {
        w: "1024",
        href: "/assets/about/brand/social/social@1024w.png",
      },
    ],
  },
];

const getFileExtensionFromPath = (url: string) =>
  url.substring(url.lastIndexOf(".") + 1, url.length) || url;

function ColorIndicator({
  color = "rgb",
  type,
}: {
  color: string;
  type: string;
}) {
  const newColor = Color(color);
  let print = color;
  if (type === "rgb") print = newColor.rgb().string();
  if (type === "hsl") print = newColor.hsl().round().string();
  return (
    <span className="flex flex-row items-center uppercase">
      <Circle className="h-4 text-gray-200" fill={color} />
      <code>{print}</code>
    </span>
  );
}

function FileExtensionWidget({ href }: { href: string }) {
  const fileInfo = "https://fileinfo.com/extension/";
  const getExtension = getFileExtensionFromPath(href);
  return (
    <span className="flex flex-row items-center gap-1">
      <code className="uppercase">{getExtension}</code>
      <Link href={combineURLs(fileInfo, getExtension)}>
        <HelpCircle className="w-4 h-4" />
      </Link>
    </span>
  );
}

const Brand = ({ blue }: { blue: string }) => {
  const brandColors = [
    {
      id: "900",
      color: blue[900],
      library: "Pantone 282",
      name: "Oxford Blue",
    },
    { id: "800", color: blue[800] },
    { id: "700", color: blue[700] },
    { id: "600", color: blue[600] },
    { id: "500", color: blue[500] },
    { id: "400", color: blue[400] },
    { id: "300", color: blue[300] },
    { id: "200", color: blue[200] },
    { id: "100", color: blue[100] },
    { id: "50", color: blue[50] },
  ];
  return (
    <TextPage
      title="Brand Assets"
      description="Some handy resources for building things for Sudbury RC."
      ogImage="/assets/og/brand.png"
    >
      <h2>Crest</h2>
      <p>
        This version of our crest is intended to work well on screens, is based
        on all the locatable extinct and extant crests, and is optimised as a
        tiny 6&nbsp;KB SVG string.
      </p>
      <p>
        If you can’t find what you need,{" "}
        <Link
          href={`/contact?to=5b54081d-46f0-485b-83c2-691e086fdf19&message=Crest Support Group: `}
        >
          <a className="transition hover:text-black">
            Will might be able to help
          </a>
        </Link>
        .
      </p>
      {brandAssets.map((item, i) => (
        <section key={i}>
          <figure>
            <item.Illustration
              className="h-32 max-w-full bg-gray-100 bg-indicate-transparency"
              fill={item.color}
            />
            <figcaption>
              <h4 className="inline">{item.name}:</h4> {item.description}
            </figcaption>
          </figure>
          <table>
            <thead>
              <tr>
                <th>Colour</th>
                <th>File format</th>
                <th className="hidden sm:table-cell">Width</th>
                <th className="sr-only">Download</th>
              </tr>
            </thead>
            <tbody>
              {item.files.map((file, i) => (
                <tr key={i}>
                  <td>
                    <ColorIndicator color={item.color} type="hex" />
                  </td>
                  <td>
                    <FileExtensionWidget href={file.href} />
                  </td>
                  <td className="hidden sm:table-cell">
                    {file.w ? <code>{file.w}px </code> : "\u221e"}
                  </td>
                  <td>
                    <Link href={file.href} download>
                      <span className="hidden sm:inline">Download</span>
                      <span className="inline sm:hidden">Get</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
      <h2>Blues</h2>
      <p>
        The club colours, as{" "}
        <NextLink href="/governance/constitution">
          defined in the constitution
        </NextLink>
        , are Oxford blue and white. We take heed of the{" "}
        <NextLink href="https://www.ox.ac.uk/sites/files/oxford/media_wysiwyg/Oxford%20Blue%20LR.pdf">
          University of Oxford’s usage
        </NextLink>{" "}
        and identify Oxford blue as <strong>Pantone 282</strong>.
      </p>
      <p>
        White is undefined. On the web, SRC has used `#fff` and `white` since
        the mid-nineties, so we use it now on someone else’s conscience.
      </p>
      <p>
        This website’s design system includes a ten-step shade graduation based
        on Pantone 282. This allows us to use visually congruent lighter blues
        in interface design.
      </p>
      <figure>
        <div
          className="w-full h-16 bg-blue-900 rounded shadow"
          style={{
            background: `linear-gradient(to right, ${brandColors.map(
              (a) => a.color
            )})`,
          }}
        />
        <figcaption>
          A visual representation of the shade scale, starting at the original
          Oxford Blue.
        </figcaption>
      </figure>
      <p>
        These colour definitions are provided in case they’re of any help to
        anyone –&nbsp;<code>900</code> is the ‘official’ club colour. The shade
        scale may change in development, but the values on this page are
        programmatically extracted from the design system and will immediately
        reflect any changes.
      </p>

      <table>
        <thead>
          <tr>
            <th className="text-right">Identifier</th>
            <th>Name</th>
            <th>RGB</th>
            <th>Hex</th>
          </tr>
        </thead>
        <tbody>
          {brandColors.map((item) => (
            <tr
              key={item.id}
              className={item.id === "900" ? "bg-gray-100" : ""}
            >
              <td className="text-right">
                <code>{item.id}</code>
              </td>
              <td>
                <span className="text-sm font-medium">
                  {item.name} {item.library}
                </span>
              </td>
              <td>
                <ColorIndicator color={item.color} type="rgb" />
              </td>
              <td>
                <ColorIndicator color={item.color} type="hex" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TextPage>
  );
};

export default Brand;

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    blue: {
      50: tailwindConfig.theme.extend.colors.blue[50],
      100: tailwindConfig.theme.extend.colors.blue[100],
      200: tailwindConfig.theme.extend.colors.blue[200],
      300: tailwindConfig.theme.extend.colors.blue[300],
      400: tailwindConfig.theme.extend.colors.blue[400],
      500: tailwindConfig.theme.extend.colors.blue[500],
      600: tailwindConfig.theme.extend.colors.blue[600],
      700: tailwindConfig.theme.extend.colors.blue[700],
      800: tailwindConfig.theme.extend.colors.blue[800],
      900: tailwindConfig.theme.extend.colors.blue[900],
    },
  },
});
