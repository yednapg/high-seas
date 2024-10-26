import {
  constructMagicSession,
  getSession,
  verifySession,
} from "@/app/utils/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const magicAuthToken = searchParams.get("magic_auth_token");

  if (magicAuthToken) {
    console.info("maigc auth token:", magicAuthToken);
    // First check for is_full_user, if so, redirect to slack auth
    // const person =

    const mc = await constructMagicSession(magicAuthToken);
    console.log("VERIFYING", mc, await verifySession(mc));

    const magicResponse = NextResponse.redirect(
      new URL(request.nextUrl.pathname, request.url),
    );
    magicResponse.cookies.set("hs-session", JSON.stringify(mc));
    return magicResponse;
  }

  const protectedPaths = ["/the-keep"];
  if (protectedPaths.includes(request.nextUrl.pathname)) {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(
        new URL(
          "/?msg='You have to be logged in to access that!'",
          request.url,
        ),
      );
    }
  }

  return NextResponse.next();
}
