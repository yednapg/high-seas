import { createMagicSession } from "@/app/utils/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const magicAuthToken = searchParams.get("magic_auth_token");

  const response = NextResponse.next();

  if (magicAuthToken) {
    await createMagicSession(magicAuthToken);
  }

  return response;
}
