"use client";

import { HelpCircle } from "lucide-react";
import { useRef } from "react";
import { Link } from "@/components/stour/link";
import { combineURLs } from "@/lib/helpers/combineURLs";
import { cn } from "@/lib/utils";
import type { BrandAssetType } from "./brand-assets";
import { ColorIndicator } from "./color-indicator";
import { DownloadImageButton } from "./download-buttons";

function FileExtensionWidget({ extension }: { extension: string }) {
  const fileInfo = "https://fileinfo.com/extension/";

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

export const BrandAsset = ({
  name,
  Illustration,
  color,
  description,
  downloads,
}: BrandAssetType) => {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <section key={name}>
      <figure>
        {Illustration && (
          <Illustration
            className={cn(
              "bg-gray-100 bg-indicate-transparency",
              name.toLowerCase().includes("lockup") ? "max-w-full" : "h-48",
              color.toLowerCase().slice(undefined, 4) === "#fff" &&
                "backdrop-brightness-75",
            )}
            fill={color}
            ref={svgRef}
          />
        )}
        <figcaption>
          <h4 className="inline">{name}:</h4> {description}
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
          {downloads.map((download) => (
            <tr key={download.format + download.width}>
              <td>
                <ColorIndicator color={color} type="hex" />
              </td>
              <td>
                <FileExtensionWidget extension={download.format} />
              </td>
              <td className="hidden sm:table-cell">
                {download.width ? <code>{download.width}px </code> : "\u221e"}
              </td>
              <td>
                <DownloadImageButton
                  className="text-blue-500 transition-colors hover:text-blue-600"
                  format={download.format}
                  svgRef={svgRef}
                  width={download.width}
                >
                  <span className="hidden sm:inline">Download</span>
                  <span className="inline sm:hidden">Get</span>
                  <span> &darr;</span>
                </DownloadImageButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
