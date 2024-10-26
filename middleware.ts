import { constructMagicSession, verifySession } from "@/app/utils/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("middleware running");

  const searchParams = request.nextUrl.searchParams;
  const magicAuthToken = searchParams.get("magic_auth_token");

  const response = NextResponse.next();
  console.log("middleware running2");

  if (magicAuthToken) {
    console.info("maigc auth token:", magicAuthToken);
    // First check for is_full_user, if so, redirect to slack auth
    // const person =

    const mc = await constructMagicSession(magicAuthToken);
    console.log("VERIFYING", mc, await verifySession(mc));

    response.cookies.set("hs-session", JSON.stringify(mc));
  }

  return response;
}
