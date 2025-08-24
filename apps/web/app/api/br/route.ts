import { NextResponse } from "next/server";
import { fetchBritishRowingFeed } from "@/lib/server/fetchBritishRowingFeed";

export const revalidate = 86_400;

export const GET = async () => {
  try {
    return NextResponse.json(await fetchBritishRowingFeed());
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Unknown error",
      { status: 500 },
    );
  }
};
