"use client";

import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Shipyard from "../shipyard/shipyard";
import Battles from "../battles/battles";
import Shop from "../shop/shop";
import { useEffect } from "react";
import SignPost from "../signpost/signpost";
import { type SafePerson, safePerson } from "../../utils/airtable";
// import { WakaLock } from "../../../components/ui/waka-lock";
import { tour } from "./tour";
import useLocalStorageState from "../../../../lib/useLocalStorageState";
import { useRouter } from "next/navigation";
import { getSession, type HsSession } from "@/app/utils/auth";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { sample, zeroMessage } from "../../../../lib/flavor";
import Cookies from "js-cookie";
import JaggedCard from "@/components/jagged-card";

const Balance = () => {
  "use client";

  const [open, setOpen] = useState(false);
  const brokeMessage = useMemo(() => sample(zeroMessage), []);

  const balance = Number(Cookies.get("tickets"));
  if (Number.isNaN(balance)) {
    getSession().then((s) =>
      console.error(
        "Ticket balance is NaN, which signals an issue with the ticket fetching from Airtable in middleware. Session: ",
        JSON.stringify(s),
      ),
    );
  }

  return (
    <Popover open={open && balance == 0} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex items-center gap-1">
          <img
            src="doubloon.svg"
            alt="doubloons"
            className="w-4 sm:w-5 h-4 sm:h-5"
          />
          <span className="mr-2">
            {balance || balance === 0 ? Math.floor(balance) : "..."}
            <span className="sm:inline hidden"> Doubloons</span>
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="text-sm">
          {brokeMessage} Ship something to earn more!
        </div>
      </PopoverContent>
    </Popover>
  );
};

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-purple-dark rounded-lg p-8 text-white text-center">
        <p className="text-xl mb-4">Loading...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
};

export default function Harbor({
  currentTab,
  session,
}: {
  currentTab: string;
  session: HsSession;
}) {
  // default to true so we don't flash a warning at the user
  const [hasHb, setHasHb] = useLocalStorageState<boolean>("cache.hasHb", true);
  // All the content management for all the tabs goes here.
  const [myShipChains, setMyShipChains] = useLocalStorageState(
    "cache.myShipChains",
    null,
  );

  const router = useRouter();

  const handleTabChange = (newTab: string) => {
    router.push(`/${newTab}`); // Navigate to the new tab slug
  };

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const initializeHarbor = async () => {
  //     try {
  //       // const { hasHb } = await fetchWaka();
  //       // setHasHb(hasHb);
  //       // const p: SafePerson = await safePerson();
  //       // if (!p.hasCompletedTutorial) {
  //       //   console.warn("1 triggering tour");
  //       //   tour();
  //       // }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   initializeHarbor();
  // }, []);

  // Keep ships and shipChain in sync
  // useEffect(() => {
  //   getUserShips(session.slackId).then(({ shipChains }) =>
  //     setMyShipChains(shipChains),
  //   );
  // }, [myShips]);

  const tabs = [
    {
      name: (
        <>
          <img src="/signpost.png" className="mr-2" width={16} alt="" />
          Signpost
        </>
      ),
      path: "signpost",
      component: <SignPost session={session} />,
    },
    {
      name: <>Shipyard</>,
      path: "shipyard",
      component: <Shipyard session={session} shipChains={myShipChains} />,
      lockOnNoHb: true,
    },
    {
      name: <>Wonderdome</>,
      path: "wonderdome",
      component: <Battles session={session} />,
      lockOnNoHb: true,
    },
    {
      name: <>Shop</>,
      path: "shop",
      component: <Shop session={session} />,
    },
  ];

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="mt-4">
        {!hasHb ? (
          <JaggedCard className="!p-4">
            <p className="text-center text-white">
              No Hakatime install detected. Have you run the script?{" "}
              <a className="underline" href="/signpost">
                See the instructions at the Signpost.
              </a>
            </p>
          </JaggedCard>
        ) : null}
        <Tabs
          value={currentTab}
          className="flex-1 flex flex-col"
          onValueChange={handleTabChange}
        >
          <TabsList className="mx-2 my-2 relative">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.path} value={tab.path}>
                {tab.name}
              </TabsTrigger>
            ))}
            <div className="right-px absolute mr-px text-green-400 text-sm">
              <Balance />
            </div>
          </TabsList>
          <div className="flex-1 p-3" id="harbor-tab-scroll-element">
            {tabs.map((tab) => (
              <TabsContent key={tab.path} value={tab.path} className="h-full">
                {tab.component}
                {/* {tab.lockOnNoHb &&
              hasWakaHb === false &&
              sessionStorage.getItem("tutorial") !== "true" ? (
                <WakaLock
                  wakaOverride={() => setHasWakaHb(true)}
                  wakaToken={wakaToken}
                  tabName={tab.name}
                />
              ) : (
                tab.component
              )} */}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </>
  );
}
