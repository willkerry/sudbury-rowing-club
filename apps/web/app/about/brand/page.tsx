import { blue, Crest, Wordmark } from "@sudburyrc/blue";
import Color from "color";
import a from "indefinite";
import { Circle, HelpCircle } from "lucide-react";
import type { Metadata } from "next";
import NextLink from "next/link";
import toWords from "num-words";
import { capitalize } from "radash";
import { SharePlayground } from "@/components/about/share-playground";
import TextPage from "@/components/layouts/text-page";
import { Social } from "@/components/logo/social";
import { Copy } from "@/components/stour/copy";
import { Link } from "@/components/stour/link";
import { createMetadata } from "@/lib/create-metadata";
import { combineURLs } from "@/lib/helpers/combineURLs";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Brand Assets",
    description: "Some handy resources for building things for Sudbury RC.",
  }),
};

const brandAssets = [
  {
    Illustration: Crest,
    color: "#002147",
    description: "Crest in Oxford Blue",
    files: [
      {
        href: "/assets/about/brand/primary/primary.svg",
        w: "",
      },
      {
        href: "/assets/about/brand/primary/primary.pdf",
        w: "",
      },
      {
        href: "/assets/about/brand/primary/primary@1280w.png",
        w: "1280",
      },
      {
        href: "/assets/about/brand/primary/primary@640w.png",
        w: "640",
      },
    ],
    name: "Primary",
  },
  {
    Illustration: Crest,
    color: "#FFF",
    description: "Crest in white",
    files: [
      {
        href: "/assets/about/brand/white/white.svg",
        w: "",
      },
      {
        href: "/assets/about/brand/white/white.pdf",
        w: "",
      },
      {
        href: "/assets/about/brand/white/white@1280w.png",
        w: "1280",
      },
      {
        href: "/assets/about/brand/white/white@640w.png",
        w: "640",
      },
    ],
    name: "White",
  },
  {
    Illustration: Wordmark,
    color: "#002147",
    description: "A composited logo that contains both crest and wordmark.",
    files: [
      {
        format: "SVG",
        href: "/assets/about/brand/logo/logo.svg",
        w: "",
      },
      {
        format: "PDF",
        href: "/assets/about/brand/logo/logo.pdf",
        w: "",
      },
      {
        format: "PNG",
        href: "/assets/about/brand/logo/logo@2560w.png",
        w: "2560",
      },
      {
        format: "PNG",
        href: "/assets/about/brand/logo/logo@1280w.png",
        w: "1280",
      },
    ],
    name: "Primary with text",
  },
  {
    color: "#FFF",
    description: "A composited logo that contains both crest and wordmark.",
    files: [
      {
        format: "SVG",
        href: "/assets/about/brand/logo/logo-white.svg",
        w: "",
      },
      {
        format: "PDF",
        href: "/assets/about/brand/logo/logo-white.pdf",
        w: "",
      },
      {
        format: "PNG",
        href: "/assets/about/brand/logo/logo-white@2560w.png",
        w: "2560",
      },
      {
        format: "PNG",
        href: "/assets/about/brand/logo/logo-white@1280w.png",
        w: "1280",
      },
    ],
    name: "Primary in white with text",
  },
  {
    Illustration: Social,
    color: "#003B80",
    description:
      "A square image with a background, for use on platforms that require profile pictures.",
    files: [
      {
        href: "/assets/about/brand/social/social@1024w.png",
        w: "1024",
      },
    ],
    name: "Social",
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
    <span className="flex flex-row items-center text-xs">
      <Circle className="h-4 text-gray-200" fill={color} />
      <Copy value={print.toUpperCase()} />
    </span>
  );
}

function FileExtensionWidget({ href }: { href: string }) {
  const fileInfo = "https://fileinfo.com/extension/";
  const extension = getFileExtensionFromPath(href);

  return (
    <span className="flex flex-row items-center gap-1">
      <code className="uppercase">{extension}</code>
      <Link href={combineURLs(fileInfo, extension)}>
        <span className="sr-only">{`About ${extension.toUpperCase()} files`}</span>
        <HelpCircle aria-hidden className="h-4 w-4" />
      </Link>
    </span>
  );
}

const brandColorCount = Object.keys(blue).length;

const brandColors = Object.entries(blue)
  .map(([id, color], i) => {
    const isLast = i === brandColorCount - 1;

    return {
      color,
      id,
      library: isLast ? "Pantone 282" : undefined,
      name: isLast ? "Oxford Blue" : undefined,
    };
  })
  .reverse();

const Brand = () => (
  <TextPage title="Brand Assets">
    <h2>Crest</h2>
    <p>
      This is a somewhat simplified version of our crest, based on characterful
      twentieth century hand-drawn versions, and intended specifically for use
      on screens. It is a vector graphic, so it can be scaled to any size
      without loss of quality, and is distributed as a near-optimal{" "}
      <span className="disambiguate">6&nbsp;KB</span> SVG string. For other
      applications (e.g. embroidery), completely different versions of the crest
      are available.
    </p>

    {brandAssets.map((item) => (
      <section key={item.name}>
        <figure>
          {item.Illustration && (
            <item.Illustration
              className="max-h-32 max-w-full bg-gray-100 bg-indicate-transparency"
              fill={item.color}
            />
          )}
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
            {item.files.map((file) => (
              <tr key={file.href}>
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

    <h2>{capitalize(toWords(brandColorCount))} blues</h2>

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
      This website’s design system includes {a(toWords(brandColorCount))}
      -step shade graduation based on Pantone 282. This allows us to use
      visually congruent lighter blues in interface design.
    </p>

    <figure>
      <div
        className="h-16 w-full rounded-sm bg-blue-950 shadow-sm"
        style={{
          background: `linear-gradient(to right, ${brandColors.map(
            (a) => a.color,
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
      anyone –&nbsp;<code>950</code> is the ‘official’ club colour. The shade
      scale may change in development, but the values on this page are
      programmatically extracted from the design system and will immediately
      reflect any changes.
    </p>

    <table>
      <thead>
        <tr>
          <th className="text-right">
            <span className="hidden sm:inline">Identifier</span>
            <span className="inline sm:hidden">ID</span>
          </th>
          <th>Name</th>
          <th className="hidden sm:table-cell">RGB</th>
          <th>Hex</th>
        </tr>
      </thead>

      <tbody>
        {brandColors.map((item) => (
          <tr key={item.id} className={item.id === "900" ? "bg-gray-100" : ""}>
            <td className="text-right">
              <code>{item.id}</code>
            </td>
            <td>
              <span className="font-medium text-sm">
                {item.name} {item.library}
              </span>
            </td>
            <td className="hidden sm:table-cell">
              <ColorIndicator color={item.color} type="rgb" />
            </td>
            <td>
              <ColorIndicator color={item.color} type="hex" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2>Fonts</h2>

    <p>The club has no official typeface, but the typefaces used here are:</p>

    <ul>
      <li>
        <a href="https://rsms.me/inter/">
          <strong>Inter</strong>
        </a>{" "}
        by Rasmus Andersson, for pretty much everything. It’s a great typeface
        for user interfaces, provided ‘free’ to the world by a very
        well-respected software designer.
      </li>

      <li>
        <a href="https://fonts.adobe.com/fonts/sweet-sans-pro">
          <strong>Sweet Sans Pro</strong>
        </a>{" "}
        by Mark van Bronkhorst, for the logo. This is a commercial typeface,
        licensed only for the logo design. It was chosen for its resemblance to
        the lettering pressed into an early twentieth century set of club
        Christmas cards.
      </li>

      <li>
        <span className="font-bold font-mono">
          <a href="https://jetbrains.com/mono">JetBrains Mono</a>
        </span>
        , for code and monospaced text. This is a free and open-source typeface
        by JetBrains, the makers of some cool developer tools. It was chosen for
        its legibility.
      </li>
    </ul>

    <p>
      The clubhouse door paint signage (which frequently appears on the
      homepage) is hand-painted each time it is repainted. We use a rough vector
      graphic based on how it appeared in 2018.
    </p>

    <h2>Share images</h2>

    <p>
      We programmatically generate share images for the less-scintillating pages
      on this website. Should you need a generic share image for something, the
      little tool below will generate one for you.
    </p>

    <div className="not-prose">
      <SharePlayground />
    </div>
  </TextPage>
);

export default Brand;
