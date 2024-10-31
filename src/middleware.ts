import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSession } from "./app/utils/auth";
import {
  fetchShips,
  fetchSignpostFeed,
  fetchWaka,
  person,
} from "./app/utils/data";

export async function middleware(request: NextRequest) {
  const slackId = await getSession().then((p) => p?.slackId);

  const response = NextResponse.next();
  if (!slackId) return response;

  // Ships base
  if (!request.cookies.get("ships")) {
    const ships = await fetchShips(slackId);
    response.cookies.set({
      name: "ships",
      value: JSON.stringify(ships),
      path: "/",
      expires: new Date(Date.now() + 5 * 60 * 1000), // In 5 mins
    });
  }

  if (!request.cookies.get("waka")) {
    const wakaData = await fetchWaka();
    response.cookies.set({
      name: "waka",
      value: JSON.stringify(wakaData),
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 1000), // In 1 hour
    });
  }

  if (!request.cookies.get("signpost-feed")) {
    const signpostFeed = await fetchSignpostFeed();
    response.cookies.set({
      name: "signpost-feed",
      value: JSON.stringify(signpostFeed),
      path: "/signpost",
      expires: new Date(Date.now() + 30 * 60 * 1000), // In 30 minutes
    });
  }

  return response;
}

export const config = {
  matcher: ["/signpost", "/shipyard", "/wonderdome", "/shop"],
};
