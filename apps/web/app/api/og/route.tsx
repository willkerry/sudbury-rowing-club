import { Wordmark } from "@sudburyrc/blue";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { env } from "@/env";
import { BASE_URL } from "@/lib/constants";
import { routeHandlerRatelimiter } from "@/lib/rate-limiter";
import { variants } from "./variants";

export const runtime = "edge";

const ErrorResponse = (message: string) =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        fontSize: 24,
        height: "100%",
        justifyContent: "center",
        padding: 1,
        textAlign: "center",
        width: "100%",
      }}
    >
      {message}
    </div>,
    {
      height: 120,
      width: 120,
    },
  );

const ShareImageSchema = z.object({
  subtitle: z.string().default("").optional(),
  title: z.string(),
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
    fetch(new URL("/Inter-Bold.ttf", env.APP_URL || BASE_URL)).then((res) =>
      res.arrayBuffer(),
    ),
    fetch(new URL("/Inter-Medium.ttf", env.APP_URL || BASE_URL)).then((res) =>
      res.arrayBuffer(),
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
        backgroundColor: bg,
        color: fg,
        display: "flex",
        height: "100%",
        padding: 100,
        width: "100%",
      }}
    >
      <div
        style={{
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <Wordmark
            style={{
              height: (400 * 50) / 302,
              width: 400,
            }}
            suppressTitle
          />

          {subtitle && (
            <div
              style={{
                color: mg,
                fontSize: 23,
                letterSpacing: 2,
                margin: "3.7px 0 0 32px",
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            background: `linear-gradient(90deg, ${g1} 0%, ${g2} 100%)`,
            backgroundClip: "text",
            color: "transparent",
            fontSize: 72,
            fontWeight: weight,
            letterSpacing: spacing,
            margin: "10px 0",
          }}
        >
          {title}
        </div>
      </div>
    </div>,
    {
      height: 600,
      width: 1200,
      fonts: [
        {
          data: semiboldFont,
          name: "Inter",
          weight: 600,
        },
        {
          data: mediumFont,
          name: "Inter",
          weight: 500,
        },
      ],
    },
  );
};
