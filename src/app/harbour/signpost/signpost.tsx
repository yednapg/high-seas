import { hasRecvFirstHeartbeat, getWakaEmail } from "../../utils/waka";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import ScalesImage from "/public/scales.svg";
import { Card } from "@/components/ui/card";
import WakaTimeConfigTabs from "./wakatime-config-tabs";
import Pill from "@/components/ui/pill";

const keyLocations = [
  {
    title: "The Keep",
    subtitle: <p>Submit your projects here when they're done!</p>,
    path: "/the-keep",
  },
  {
    title: "Thunderdome",
    subtitle: (
      <p>
        Vote between projects others have made! After submitting your project,
        you must vote between project matchups in order to earn
        <Pill
          msg="Scales"
          color="green"
          glyphImage={<Image src={ScalesImage} alt="scales" height={20} />}
        />
        . Note that the number of{" "}
        <Pill
          msg="Scales"
          color="green"
          glyphImage={<Image src={ScalesImage} alt="scales" height={20} />}
        />{" "}
        you earn is based on the number of hours you have put in your own
        project, and how it competes against other projects. Everything is peer
        voted!
      </p>
    ),
    path: "/thunderdome",
  },
  {
    title: "Shoppe",
    subtitle: (
      <p>
        Spend all your{" "}
        <Pill
          msg="Scales"
          color="green"
          glyphImage={<Image src={ScalesImage} alt="scales" height={20} />}
        />{" "}
        here! Get items, ranging from Blahajs to Yubikeys. More items to come in
        the future!
      </p>
    ),
    path: "/shop",
  },
];

export default function SignPost({
  session,
  wakaToken,
  email,
}: {
  session: any;
  wakaToken: string | null;
  email: string | null;
}) {
  useEffect(() => {
    hasRecvFirstHeartbeat().then((a) =>
      console.log("has recv first heartbeat:", a),
    );
  }, []);

  const motionProps = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    }),
    [],
  );

  return (
    <motion.div
      {...motionProps}
      className="container mx-auto px-4 py-8 max-w-prose"
    >
      <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-300 mb-6 text-center">
        Welcome to the signpost
      </h1>

      <p>
        Low Skies tracks your time spent coding, which factors into how many
        <Pill
          msg="Scales"
          color="green"
          glyphImage={<Image src={ScalesImage} alt="scales" height={20} />}
        />{" "}
        you get when your projects are voted on in the{" "}
        <a href="/thunderdome" className="text-blue-500">
          Thunderdome
        </a>{" "}
        by other Hack Clubbers.{" "}
        <Pill
          msg="Scales"
          color="green"
          glyphImage={<Image src={ScalesImage} alt="scales" height={20} />}
        />{" "}
        can be exchnged for items in the{" "}
        <a href="/shop" className="text-blue-500">
          Shoppe
        </a>
        .
      </p>
      <br />
      <p>
        Low Skies uses the WakaTime VSCode extension to track how much time you
        spend on your projects. Specifically,
        <Link
          target="_blank"
          className="text-blue-500"
          href="https://waka.hackclub.com"
        >
          {" "}
          a Hack Clubber-forked open source version
        </Link>
        .
      </p>
      <br />
      <p>
        Let's set up WakaTime! First, install the{" "}
        <a href="https://wakatime.com/vs-code" className="text-blue-500">
          VS Code extension
        </a>
        . Next, we need to edit the configuration file to put in our WakaTime
        token (to identify you), and a custom URL (to tell the extension to send
        the data it collects to Low Skies).
      </p>
      <br />

      <p>
        Your WakaTime config (located at <code>~/.wakatime.cfg</code>) needs to
        be exactly this;
      </p>
      <Card className="p-2">
        <pre className="text-left">
          <code>
            {wakaToken ? (
              <>
                [settings]
                <br />
                api_url = https://waka.hackclub.com/api
                <br />
                api_key = {wakaToken}
              </>
            ) : (
              "loading..."
            )}
          </code>
        </pre>
      </Card>
      <br />
      <p>
        If you know what you're doing, go ahead and paste that in.
        Alternatively, you can run this script in your terminal!
      </p>
      {wakaToken ? <WakaTimeConfigTabs wakaToken={wakaToken} /> : null}
      <br />
      <p>
        To log in to the dashboard, your username is your Slack ID (
        <code>{session ? session?.payload?.sub : "???"}</code>), and your email
        is <code>{email ? email : "???"}</code>. You'll need to request a
        password reset link (unless you've already signed up for Hackatime!)
      </p>

      <h2 className="text-center text-2xl mb-2 mt-6 text-blue-500">
        Key Locations
      </h2>
      <div className="mx-auto space-y-3">
        {keyLocations.map((location) => (
          <motion.a
            whileHover={{ scale: 1.02, rotate: "3deg" }}
            href={location.path}
            className="block"
          >
            <Card className="p-2 text-left">
              <p className="text-xl">{location.title}</p>

              {location.subtitle}
            </Card>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
