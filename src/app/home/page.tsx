import { redirect } from "next/navigation";
import Harbour from "../harbour/page";
import { getSession } from "../utils/auth";

export default async function Home() {
  const session = await getSession();

  if (!session) return redirect("/");

  return <Harbour session={session} />;
}
