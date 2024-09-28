import SignIn from "@/components/sign_in";
import HighSeas from "/public/logo.png";
import BackgroundImage from "/public/bg.png";
import Image from "next/legacy/image";

export default function Marketing() {
  return (
    <div className="w-full h-full max-w-prose mx-auto">
      <Image
        className="-z-10 fixed inset-0 w-full h-full object-cover"
        src={BackgroundImage}
        alt=""
        style={{
          maxWidth: "100%",
          height: "auto"
        }} />
      <header className="w-fit mx-auto flex flex-col items-center gap-4">
        <Image
          src={HighSeas}
          alt="high seas"
          style={{
            maxWidth: "100%",
            height: "auto"
          }} />
        <h1 className="text-white text-2xl">Welcome to High Seas</h1>
      </header>

      <SignIn />

      <div className="text-white">
        <p>This is the signed out marketing page</p>
        <br />
        <p>
          Body body body body body body body body body body body body body body
          body body body body body body body body body body body body body body
          body body body body body body body body body body body body body body
          body body body body body body body body body body body body body body
          body body body body body body body body body body body body body body
          body body body body body body body body body body body body body body
          body
        </p>
      </div>
    </div>
  );
}
