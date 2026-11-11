import type { MetadataRoute } from "next";
import { env } from "@/env";
import { BASE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  if (env.NEXT_PUBLIC_APP_ENV === "preview") {
    return { rules: [{ disallow: "/", userAgent: "*" }] };
  }

  return {
    sitemap: `${BASE_URL}/sitemap.xml`,
    rules: [
      {
        allow: "/",
        userAgent: "*",
      },
    ],
  };
}
