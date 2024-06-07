import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("MIDDLEWARE", request.url);

  return NextResponse.redirect(new URL("/news+/author/", request.url));
}

export const config = {
  matcher: "/news/author/:path*",
};
