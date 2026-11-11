import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

/**
 * Sanity webhook target: published content changes invalidate every cached
 * page, since pages are otherwise cached for the lifetime of a deploy.
 */
export const POST = async (request: NextRequest) => {
  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);

  if (
    !(
      signature &&
      (await isValidSignature(body, signature, env.SANITY_REVALIDATE_SECRET))
    )
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true });
};
