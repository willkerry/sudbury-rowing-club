import TextPage from "@/components/layouts/text-page";
import Crest from "@/components/logo/crest";
import Link from "@/components/stour/link";
import NextLink from "next/link";
import { Circle, HelpCircle } from "react-feather";
import Logo from "@/components/logo";
import urljoin from "url-join";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "/tailwind.config.js";
import Color from "color";
import Social from "@/components/logo/social";

const fullConfig = resolveConfig(tailwindConfig);

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

const brandColors = [
  {
    id: "900",
    color: fullConfig.theme.colors.blue[900],
    library: "Pantone 282",
    name: "Oxford Blue",
  },
  { id: "800", color: fullConfig.theme.colors.blue[800] },
  { id: "700", color: fullConfig.theme.colors.blue[700] },
  { id: "600", color: fullConfig.theme.colors.blue[600] },
  { id: "500", color: fullConfig.theme.colors.blue[500] },
  { id: "400", color: fullConfig.theme.colors.blue[400] },
  { id: "300", color: fullConfig.theme.colors.blue[300] },
  { id: "200", color: fullConfig.theme.colors.blue[200] },
  { id: "100", color: fullConfig.theme.colors.blue[100] },
  { id: "50", color: fullConfig.theme.colors.blue[50] },
];

function extension(url) {
  return url.substring(url.lastIndexOf(".") + 1, url.length) || url;
}

const fileInfo = "https://fileinfo.com/extension/";

export default function Brand() {
  function ColorIndicator({ color, type }) {
    const newColor = Color(color);
    const rgb = newColor.rgb().string();
    const hsl = newColor.hsl().round().string();
    return (
      <span className="flex flex-row items-center uppercase">
        <Circle className="h-4 text-gray-200" fill={color} />
        {type === "hex" ? (
          <code>{color}</code>
        ) : type === "rgb" ? (
          <code>{rgb}</code>
        ) : type === "hsl" ? (
          <code>{hsl}</code>
        ) : (
          <code>{rgb}</code>
        )}
      </span>
    );
  }
  function FileExtensionWidget({ href }) {
    const getExtension = extension(href);
    return (
      <span className="flex flex-row items-center gap-1">
        <code className="uppercase">{getExtension}</code>
        <Link href={urljoin(fileInfo, getExtension)}>
          <HelpCircle className="w-4 h-4" />
        </Link>
      </span>
    );
  }
  const FileRows = ({ data, color }) => {
    return data.map((item, index) => {
      return (
        <tr key={index}>
          <td>
            <ColorIndicator color={color} type="hex" />
          </td>
          <td>
            <FileExtensionWidget href={item.href} />
          </td>
          <td className="hidden sm:table-cell">{item.w ? <code>{item.w}px </code> : "\u221e"}</td>
          <td>
            <Link href={item.href} download>
              <span className="hidden sm:inline">Download</span>
              <span className="inline sm:hidden">Get</span>
            </Link>
          </td>
        </tr>
      );
    });
  };
  const ColorRows = ({ data }) => {
    return data.map((item, index) => {
      return (
        <tr key={index} className={item.id == "900" && "bg-gray-100"}>
          <td className="text-right">
            <code>{item.id}</code>
          </td>
          <td>
            <span className="text-sm font-medium">
              {item.name}
              {item.library && ` (${item.library})`}
            </span>
          </td>
          <td>
            <ColorIndicator color={item.color} type="rgb" />
          </td>
          <td>
            <ColorIndicator color={item.color} type="hex" />
          </td>
        </tr>
      );
    });
  };
  const AssetSections = ({ data }) => {
    return data.map((data) => {
      return (
        <section key={data.index}>
          <figure>
            <data.Illustration
              className="h-32 max-w-full bg-gray-100 bg-indicate-transparency"
              fill={data.color}
            />
            <figcaption>
              <h4 className="inline">{data.name}:</h4> {data.description}
            </figcaption>
          </figure>
          <table>
            <thead>
              <tr>
                <th>Colour</th>
                <th>File format</th>
                <th className="hidden sm:table-cell">Width</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <FileRows data={data.files} color={data.color} />
            </tbody>
          </table>
        </section>
      );
    });
  };

  return (
    <TextPage title="Brand Assets">
      <h2>Crest</h2>
      <p>
        This version of our crest was drawn from scratch for better performance
        on screens. It’s two years in development, is in (roughly) version 17,
        and will keep evolving.
      </p>
      <p>
        It’s not meant to replace any of the six-plus crests we already use –
        instead it’s a sort of an average of all of them, intended to work on
        screens and be expressed as a tiny 6 KB SVG string.
      </p>
      <AssetSections data={brandAssets} />
      <h2>Blues</h2>
      <p>
        The club colours, as{" "}
        <NextLink href="/governance/constitution">
          defined in the consitution
        </NextLink>
        , are Oxford blue and white. We take heed of the{" "}
        <NextLink href="https://www.ox.ac.uk/sites/files/oxford/media_wysiwyg/Oxford%20Blue%20LR.pdf">
          University of Oxford’s usage
        </NextLink>{" "}
        and identify Oxford blue as <strong>Pantone 282</strong>.
      </p>

      <p>
        In developing our online design system, we’ve produced a ten-step shade
        graduation based on Pantone 282. This allows us to use visually
        congruent lighter blues in interface design.
      </p>
      <figure>
        <div
          className="w-full h-16 bg-blue-900 rounded shadow"
          style={{
            background: `linear-gradient(to right, ${brandColors.map(
              (a) => a.color
            )})`,
          }}
        ></div>
        <figcaption>
          A visual representation of the shade scale, starting at the original
          Oxford Blue.
        </figcaption>
      </figure>
      <p>
        These colour definitions are provided in case they’re of any help to
        anyone – <code>900</code> is the ‘official’ club colour. The shade scale
        may change in development, but the values on this page are
        programmatically extracted from the design system and will immediately
        reflect any changes.
      </p>
      <table>
        <thead>
          <th className="text-right">Identifier</th>
          <th>Name</th>
          <th>RGB</th>
          <th>Hex</th>
        </thead>
        <tbody>
          <ColorRows data={brandColors} />
        </tbody>
      </table>
    </TextPage>
  );
}
