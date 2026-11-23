import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { sanityClient } from "@sudburyrc/api";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/env";

const isSafePath = (path: string) =>
  path.startsWith("/") && !path.startsWith("//");

// Presentation calls this with a one-off secret it stored in the dataset.
export const GET = async (request: Request) => {
  const token = env.SANITY_API_READ_TOKEN;

  if (!token) {
    return new Response("Draft mode isn't configured", { status: 501 });
  }

  const { isValid, redirectTo = "/" } = await validatePreviewUrl(
    sanityClient.withConfig({ token, useCdn: false }),
    request.url,
  );

  if (!isValid) return new Response("Invalid secret", { status: 401 });

  (await draftMode()).enable();

  redirect(isSafePath(redirectTo) ? redirectTo : "/");
};
