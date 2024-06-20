import { NextResponse } from "next/server";
import { getWodehouseFullDetails } from "get-wodehouse-name";

export const revalidate = 60;

export const GET = async () => {
  try {
    const status = getWodehouseFullDetails();

    return new NextResponse(JSON.stringify(status), {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60",
      },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
