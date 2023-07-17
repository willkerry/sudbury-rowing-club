import { type NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { z } from "zod";
import Logo from "@/components/logo";
import { blue } from "stour-blue";

export const config = {
  runtime: "edge",
};

const semiboldFont = fetch(
  new URL("../../public/Inter-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const mediumFont = fetch(
  new URL("../../public/Inter-Medium.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const ErrorResponse = (message: string) =>
  new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#000",
          color: "#fff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          padding: 1,
        }}
      >
        {message}
      </div>
    ),
    {
      width: 120,
      height: 120,
    }
  );

const ShareImageSchema = z.object({
  title: z.string(),
  subtitle: z.string().default("").optional(),
  /**
   * Customise the colour scheme of the image. One of `blue`, `dark` or `light`. Defaults to `blue`.
   *
   * @default "blue"
   */
  variant: z
    .union([z.literal("blue"), z.literal("dark"), z.literal("light")])
    .default("blue"),
});

export type ShareImage = z.infer<typeof ShareImageSchema>;

const variants: Record<
  ShareImage["variant"],
  {
    bg: string;
    mg: string;
    fg: string;
    g1: string;
    g2: string;
    weight: 500 | 600;
    spacing: number;
  }
> = {
  blue: {
    bg: blue[900],
    mg: blue[200],
    fg: "#fff",
    g1: "#a1c4fd",
    g2: "#c2e9fb",
    weight: 600,
    spacing: -1,
  },
  dark: {
    bg: "#000",
    mg: "rgba(255, 255, 255, 0.5)",
    fg: "rgba(255, 255, 255, 0.8)",
    g1: "#fff",
    g2: "#fff",
    weight: 500,
    spacing: -2,
  },
  light: {
    bg: "#fff",
    mg: "rgba(0, 0, 0, 0.5)",
    fg: "rgba(0, 0, 0, 0.8)",
    g1: "#000",
    g2: "#000",
    weight: 500,
    spacing: -2,
  },
};

export const variantsList = Object.keys(variants) as ShareImage["variant"][];

const og = async (request: NextRequest): Promise<ImageResponse> => {
  const { method } = request;

  if (method !== "GET") return ErrorResponse("Invalid method");

  const { searchParams } = new URL(request.url);

  try {
    ShareImageSchema.parse(Object.fromEntries(searchParams.entries()));
  } catch (error) {
    console.log(error);

    return ErrorResponse("Invalid query");
  }

  const { title, subtitle, variant } = ShareImageSchema.parse(
    Object.fromEntries(searchParams.entries())
  );

  const fontData = await Promise.all([semiboldFont, mediumFont]);

  const { bg, mg, fg, g1, g2, weight, spacing } = variants[variant];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: bg,
          color: fg,
          padding: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Logo
              suppressTitle
              style={{
                width: 400,
                height: (400 * 50) / 302,
              }}
            />

            {subtitle && (
              <div
                style={{
                  fontSize: 23,
                  color: mg,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  margin: "3.7px 0 0 32px",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: weight,
              backgroundClip: "text",
              color: "transparent",
              background: `linear-gradient(90deg, ${g1} 0%, ${g2} 100%)`,
              margin: "10px 0",
              letterSpacing: spacing,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Inter",
          data: fontData[0],
          weight: 600,
        },
        {
          name: "Inter",
          data: fontData[1],
          weight: 500,
        },
      ],
    }
  );
};

export default og;
