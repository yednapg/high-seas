"use server";

import Marketing from "./marketing/page";
import Harbour from "./harbour/page";
import { getSession } from "@/app/utils/auth";

export default async function Page() {
  let session;
  try {
    session = await getSession();
  } catch (e) {
    console.error(e);
  }

  return <>{session ? <Harbour session={session} /> : <Marketing />}</>;
}
