import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Cache invalidation endpoint hit by Payload's after-change / after-delete
 * hooks. Pair fetches on the read side with the same tag strings, e.g.
 *
 *   sdk.find({ collection: "news" }, {
 *     next: { tags: ["payload:news"] },
 *   });
 *
 * Tags emitted:
 * - `payload:<collection>`           — broad bust for any list view
 * - `payload:<collection>:<slug>`    — narrow bust if the doc has a slug
 * - `payload:<collection>:id:<id>`   — narrow bust by id
 * - `payload:global:<slug>`          — globals
 */

interface RevalidateBody {
  collection?: string;
  global?: string;
  id?: string | null;
  slug?: string | null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET not configured" },
      { status: 500 },
    );
  }
  if (request.nextUrl.searchParams.get("secret") !== expected) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  let body: RevalidateBody;
  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const tags: string[] = [];
  if (body.collection) {
    tags.push(`payload:${body.collection}`);
    if (body.slug) tags.push(`payload:${body.collection}:${body.slug}`);
    if (body.id) tags.push(`payload:${body.collection}:id:${body.id}`);
  }
  if (body.global) {
    tags.push(`payload:global:${body.global}`);
  }

  // Next 16's revalidateTag requires a cacheLife profile to bind future
  // refreshes to. "default" matches whatever the rest of the app uses.
  for (const tag of tags) revalidateTag(tag, "default");

  return NextResponse.json({ revalidated: tags });
}
