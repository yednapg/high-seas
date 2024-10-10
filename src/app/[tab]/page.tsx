import { redirect } from "next/navigation";
import Harbour from "../harbour/tabs/tabs";
import { getSession } from "../utils/auth";

import { notFound } from 'next/navigation';

import { Card } from "@/components/ui/card";
// import { SoundButton } from "../../components/sound-button";

export default async function Page({ params }: { params: { tab: string } }) {
  const { tab } = params;

  const validTabs = ["signpost", "the-keep", "thunderdome", "shop"];
  if (!validTabs.includes(tab)) return notFound();

  const session = await getSession();
  if (!session) return redirect("/");

  return (
    <div
      className="w-screen min-h-[100vh]"
      style={{
        backgroundImage: "url(/bgoverlay.svg)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="w-full flex items-center justify-center p-8"
      >
        {/* <SoundButton /> */}
        <Card className="w-full max-w-4xl flex flex-col">
          <Harbour session={session} currentTab={tab} />
        </Card>
      </div>
    </div>
  )
}
