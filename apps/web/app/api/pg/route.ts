import { getWodehouseFullDetails } from "get-wodehouse-name";
import { NextResponse } from "next/server";

export const revalidate = 60;

export const GET = () => {
  try {
    const status = getWodehouseFullDetails();

    return new NextResponse(JSON.stringify(status), {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : error }),
      {
        status: 500,
      },
    );
  }
};
