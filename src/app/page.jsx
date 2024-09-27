"use server";

import Marketing from "./marketing";
import Harbour from "./harbour";
import { getSession } from "@/app/utils/auth";

export default async function Page() {
  let session;
  try {
    session = getSession();
  } catch (e) {
    console.error(e);
  }

  return <>{session ? <Harbour session={session} /> : <Marketing />}</>;
}
