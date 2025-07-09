import { Wordmark } from "@sudburyrc/blue";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { BASE_URL } from "@/lib/constants";
import { routeHandlerRatelimiter } from "@/lib/rate-limiter";
import { variants } from "./variants";

export const runtime = "edge";

const ErrorResponse = (message: string) =>
  new ImageResponse(
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
    </div>,
    {
      width: 120,
      height: 120,
    },
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

const getFonts = async () =>
  Promise.all([
    fetch(new URL("/Inter-Bold.ttf", process.env.APP_URL || BASE_URL)).then(
      (res) => res.arrayBuffer(),
    ),
    fetch(new URL("/Inter-Medium.ttf", process.env.APP_URL || BASE_URL)).then(
      (res) => res.arrayBuffer(),
    ),
  ]);

export const GET = async (request: NextRequest): Promise<ImageResponse> => {
  const maybeRateLimitedResponse = await routeHandlerRatelimiter(request);
  if (maybeRateLimitedResponse) return maybeRateLimitedResponse;

  const { searchParams } = new URL(request.url);

  try {
    ShareImageSchema.parse(Object.fromEntries(searchParams.entries()));
  } catch (error) {
    console.log(error);

    return ErrorResponse("Invalid query");
  }

  const { title, subtitle, variant } = ShareImageSchema.parse(
    Object.fromEntries(searchParams.entries()),
  );

  const { bg, mg, fg, g1, g2, weight, spacing } = variants[variant];

  const [semiboldFont, mediumFont] = await getFonts();

  return new ImageResponse(
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
          <Wordmark
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
    </div>,
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Inter",
          data: semiboldFont,
          weight: 600,
        },
        {
          name: "Inter",
          data: mediumFont,
          weight: 500,
        },
      ],
    },
  );
};
