export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation";
import { deleteSession } from "../utils/auth";

export async function GET() {
  console.log("SIGNING OUT!!!!!!");
  await deleteSession();
  return redirect("/");
}
