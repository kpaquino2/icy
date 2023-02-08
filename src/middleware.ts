import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.cookies.get("next-auth.session-token"))
    return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/sign-up",
};
