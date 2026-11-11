import { blue } from "@sudburyrc/blue";
import a from "indefinite";
import type { Metadata } from "next";
import NextLink from "next/link";
import toWords from "num-words";
import { capitalize } from "radashi";
import { SharePlayground } from "@/components/about/share-playground";
import TextPage from "@/components/layouts/text-page";
import { createMetadata } from "@/lib/create-metadata";
import { BrandAssets } from "./brand-assets";
import { ColorIndicator } from "./color-indicator";

export const metadata: Metadata = {
  ...createMetadata({
    description: "Some handy resources for building things for Sudbury RC.",
    title: "Brand Assets",
  }),
};

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
      without loss of quality. For other applications (e.g. embroidery),
      completely different versions of the crest are available.
    </p>

    <BrandAssets />

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
      <div className="flex flex-row gap-1.5">
        {brandColors.map((item) => (
          <div
            className="h-48 w-full rounded-sm bg-blue-950 shadow-sm"
            key={item.id}
            style={{ background: item.color }}
          />
        ))}
      </div>
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
          <tr className={item.id === "900" ? "bg-gray-100" : ""} key={item.id}>
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
