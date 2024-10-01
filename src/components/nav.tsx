"use server";

import { getSession } from "@/app/utils/auth";
import SignOut from "./sign_out";
import SignIn from "./sign_in";
import Image from "next/image";
import Logo from "/public/logo.png";
import Flag from "/public/flag-orpheus-top.svg";

export default async function Nav() {
  const session = await getSession();

  return (
    <nav className="fixed flex justify-between top-0 left-0 right-0 h-14 px-8 bg-neutral-100">
      <div className="flex gap-3 items-center">
        <Image src={Flag} alt="low skies" height={48} />
        <Image src={Logo} alt="low skies" height={48} />
      </div>
      <div className="flex gap-4 items-center text-nowrap">
        {session ? (
          <div className="flex gap-2 items-center">
            <Image
              src={session.payload.picture}
              width={32}
              height={32}
              alt="profile picture"
              className="rounded-full"
            />
            <p>Hey, {session.payload.given_name}!</p>{" "}
          </div>
        ) : null}
        {session ? <SignOut /> : <SignIn />}
      </div>
    </nav>
  );
}
