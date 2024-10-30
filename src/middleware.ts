import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./app/utils/auth";
import { fetchShips } from "./app/utils/data";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const cookies = request.cookies.getAll();
  const personId = await getSession().then((p) => p?.slackId);
  if (!personId) return response;

  if (!request.cookies.get("ships")) {
    const ships = await fetchShips(personId);
    response.cookies.set({
      name: "ships",
      value: JSON.stringify(ships),
      path: "/shipyard",
      expires: new Date(Date.now() + 10 * 60 * 1000), // In 10 mins
    });
  }

  return response;
}

export const config = {
  matcher: ["/signpost", "/shipyard", "/wonderdome", "/shop"],
};
