import { OgRenderer } from "./renderer";

export { OgRenderer };

export type Env = {
  BROWSER: Fetcher;
  OG_CACHE: R2Bucket;
  OG_RENDERER: DurableObjectNamespace<OgRenderer>;
};

// Bump after changing the share image design to re-render every image.
const TEMPLATE_VERSION = "1";
const TEMPLATE_PATH = "/og-template";

const TEMPLATE_PARAMS = ["title", "subtitle", "variant"] as const;

const toHex = (buffer: ArrayBuffer) =>
  [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const sha256 = async (value: string) =>
  toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));

const pngResponse = (body: BodyInit) =>
  new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });

const matchEdgeCache = async (key: Request) => {
  try {
    return await caches.default.match(key);
  } catch {
    return;
  }
};

const putEdgeCache = async (key: Request, response: Response) => {
  try {
    await caches.default.put(key, response);
  } catch (error) {
    console.error("Failed to write OG image to the edge cache", error);
  }
};

/**
 * Serves share images by screenshotting the site's /og-template page with
 * Browser Rendering. sudbury-web forwards /api/og here after checking the
 * request's signature, so the query is trusted; the request's origin decides
 * which deployment's template to screenshot.
 *
 * Images are cached at the edge and in R2, keyed by the template URL.
 */
export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const url = new URL(request.url);
    const params = new URLSearchParams();

    for (const name of TEMPLATE_PARAMS) {
      const value = url.searchParams.get(name);
      if (value) params.set(name, value);
    }

    if (!params.get("title")) {
      return new Response("Missing title", { status: 400 });
    }

    const target = new URL(TEMPLATE_PATH, url.origin);
    target.search = params.toString();

    const key = `${TEMPLATE_VERSION}/${await sha256(target.toString())}.png`;
    const edgeKey = new Request(new URL(`/__og-cache/${key}`, url.origin));

    const cached = await matchEdgeCache(edgeKey);
    if (cached) return cached;

    const stored = await env.OG_CACHE.get(key);

    if (stored) {
      const png = await stored.arrayBuffer();
      ctx.waitUntil(putEdgeCache(edgeKey, pngResponse(png)));

      return pngResponse(png);
    }

    const renderer = env.OG_RENDERER.get(
      env.OG_RENDERER.idFromName("singleton"),
    );

    let png: Uint8Array;

    try {
      png = await renderer.render(target.toString());
    } catch (error) {
      console.error(`Failed to render ${target}`, error);

      return new Response("Could not render image", {
        headers: { "Cache-Control": "no-store", "Retry-After": "60" },
        status: 503,
      });
    }

    ctx.waitUntil(
      Promise.all([
        env.OG_CACHE.put(key, png, {
          customMetadata: { url: target.toString() },
          httpMetadata: { contentType: "image/png" },
        }),
        putEdgeCache(edgeKey, pngResponse(png)),
      ]),
    );

    return pngResponse(png);
  },
} satisfies ExportedHandler<Env>;
