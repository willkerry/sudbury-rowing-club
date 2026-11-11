"use client";

import type { JSX } from "react";

export const DownloadSVGButton = ({
  svgRef,
  ...props
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
} & JSX.IntrinsicElements["button"]) => {
  const downloadSVG = () => {
    const svgElement = svgRef.current;

    if (!svgElement) {
      return;
    }

    const svgString = svgElement.outerHTML;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "exported.svg";
    link.click();

    URL.revokeObjectURL(url);
  };

  return <button onClick={downloadSVG} type="button" {...props} />;
};

const svgToPng = (
  svgString: string,
  width: number,
  height: number,
  originalWidth: number,
  originalHeight: number,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(
        img,
        0,
        0,
        originalWidth,
        originalHeight,
        0,
        0,
        width,
        height,
      );

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create PNG blob"));
        }
      }, "image/png");
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG"));
    };

    img.src = url;
  });

const getSvgDimensions = (svgElement: SVGElement) => {
  const viewBox = svgElement.getAttribute("viewBox");

  if (viewBox) {
    const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
    return { height: vbHeight, width: vbWidth };
  }

  const widthAttribute = svgElement.getAttribute("width");
  const heightAttribute = svgElement.getAttribute("height");

  if (widthAttribute && heightAttribute) {
    return {
      height: Number.parseInt(heightAttribute, 10),
      width: Number.parseInt(widthAttribute, 10),
    };
  }

  return { height: 400, width: 400 };
};

export const DownloadPNGButton = ({
  svgRef,
  width = 400,
  ...props
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  width?: number;
} & JSX.IntrinsicElements["button"]) => {
  const downloadPNG = async () => {
    const svgElement = svgRef.current;

    if (!svgElement) {
      return;
    }

    const svgString = svgElement.outerHTML;
    const { width: originalWidth, height: originalHeight } =
      getSvgDimensions(svgElement);

    const scale = width / originalWidth;
    const targetHeight = Math.round(originalHeight * scale);

    try {
      const pngBlob = await svgToPng(
        svgString,
        width,
        targetHeight,
        originalWidth,
        originalHeight,
      );
      const url = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "exported.png";
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PNG export failed:", error);
    }
  };

  return <button onClick={downloadPNG} type="button" {...props} />;
};

export const DownloadImageButton = ({
  svgRef,
  format,
  width,
  ...props
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  format: "png" | "svg";
  width?: number;
} & JSX.IntrinsicElements["button"]) => {
  switch (format) {
    case "svg":
      return <DownloadSVGButton svgRef={svgRef} {...props} />;
    case "png":
      return <DownloadPNGButton svgRef={svgRef} width={width} {...props} />;
  }
};
