import { type NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { z } from "zod";
import Logo from "@/components/logo";
import { blue } from "../../blue";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL("../../public/Inter-Bold.ttf", import.meta.url)
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

const searchParamsSchema = z.object({
  title: z.string(),
});

const og = async (request: NextRequest): Promise<ImageResponse> => {
  const { method } = request;

  if (method !== "GET") return ErrorResponse("Invalid method");

  const { searchParams } = new URL(request.url);

  try {
    searchParamsSchema.parse(Object.fromEntries(searchParams.entries()));
  } catch (error) {
    console.log(error);

    return ErrorResponse("Invalid query");
  }

  const hasTitle = searchParams.has("title");
  const title = hasTitle ? searchParams.get("title") : "Sudbury Rowing Club";

  const fontData = await font;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: blue[900],
          color: "#fff",
          position: "relative",
          padding: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <Logo
            suppressTitle
            style={{
              width: 400,
              height: (400 * 50) / 302,
            }}
          />

          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: blue[100],
              margin: "10px auto",
              letterSpacing: -1,
              width: "100%",
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
          data: fontData,
          weight: 600,
        },
      ],
    }
  );
};

export default og;
