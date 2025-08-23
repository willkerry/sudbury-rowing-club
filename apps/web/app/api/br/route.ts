import { NextResponse } from "next/server";
import { fetchBritishRowingFeed } from "@/lib/server/fetchBritishRowingFeed";

export const GET = async () => {
  try {
    const response = await fetchBritishRowingFeed();

    return NextResponse.json(response);
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to fetch British Rowing feed" },
      { status: 500 },
    );
  }
};
