"use server";

import { getSession } from "@/app/utils/auth";
import SignOut from "./sign_out";
import SignIn from "./sign_in";
import Image from "next/image";
import Logo from "/public/logo.png";
import Flag from "/public/flag-orpheus-top.svg";
import Link from "next/link";
import MobileMenu from "./mobile_menu";

export default async function Nav() {
  const session = await getSession();

  return (
    <nav
      className="fixed flex justify-between items-center top-0 left-0 right-0 h-14 px-4 sm:px-8 bg-neutral-100 bg-blend-color-burn z-50"
      style={{
        backgroundImage: "url(/cardboard.png)",
        backgroundColor: "#ffffffc0",
      }}
    >
      <Link href="/" className="flex gap-3 items-center">
        <Image src={Flag} alt="hack club" height={54} className="hidden lg:block" />
        <Image src={Logo} alt="low skies" height={48}/>
      </Link>  
      
      {session ? (
        <>
          {/* Desktop view */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={session.payload.picture}
                width={32}
                height={32}
                alt="profile picture"
                className="rounded-full"
              />
              <p>Hey, {session.payload.given_name}!</p>
            </div>
            <SignOut />
          </div>
          
          {/* Mobile view */}
          <MobileMenu session={session} />
        </>
      ) : (
        <SignIn variant="small" session={session} />
      )}
    </nav>
  );
}
