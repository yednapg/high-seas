import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const magicAuthToken = searchParams.get("magic_auth_token");

  const response = NextResponse.next();

  if (magicAuthToken) {
    response.cookies.set("magic-auth-token", magicAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  return response;
}
