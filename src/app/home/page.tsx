import Harbour from "../harbour/page";
import { getSession } from "../utils/auth";

export default async function Home() {
  const session = await getSession();

  return <Harbour session={session} />;
}
