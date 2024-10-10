"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Shipyard from "../shipyard/shipyard";
import Battles from "../battles/battles";
import Shop from "../shop/shop";
import { useEffect, useState } from "react";
import { ShopItem, getShop } from "../shop/shop-utils";
import { getUserShips, Ship } from "../shipyard/ship-utils";
import { JwtPayload } from "jsonwebtoken";
import SignPost from "../signpost/signpost";
import { getWaka } from "../../utils/waka";
import Image from "next/image";
import SignpostImage from "/public/signpost.png";
import { hasRecvFirstHeartbeat, getWakaEmail } from "../../utils/waka";
import Icon from "@hackclub/icons";
import Link from "next/link";
import { getPersonTicketBalance } from "../../utils/airtable";

import useLocalStorageState from "../../../../lib/useLocalStorage";
import { useRouter } from 'next/navigation';

export default function Harbour({ currentTab, session }: { currentTab: string, session: JwtPayload }) {
  // All the content management for all the tabs goes here.
  const [myShips, setMyShips] = useLocalStorageState<Ship[] | null>('cache.myShips',null);
  const [shopItems, setShopItems] = useLocalStorageState<ShopItem[] | null>('cache.shopItems', null);
  const [wakaToken, setWakaToken] = useLocalStorageState('cache.wakaToken', null);
  const [hasWakaHb, setHasWakaHb] = useLocalStorageState('cache.hasWakaHb', false);
  const [wakaEmail, setWakaEmail] = useLocalStorageState('cache.wakaEmail', null);
  const [personTicketBalance, setPersonTicketBalance] = useLocalStorageState<string>("cache.personTicketBalance", '-');
  const { toast } = useToast();

  const router = useRouter()

  const handleTabChange = (newTab) => {
    router.push(`/${newTab}`); // Navigate to the new tab slug
  };

  useEffect(() => {
    getUserShips(session.payload.sub).then((ships) => setMyShips(ships));

    getShop().then((shop) => setShopItems(shop));

    hasRecvFirstHeartbeat().then((hasHb) => setHasWakaHb(hasHb));

    getPersonTicketBalance(session.payload.sub).then((balance) =>
      setPersonTicketBalance(balance.toString()),
    );

    getWaka().then((waka) => waka && setWakaToken(waka.api_key));

    getWakaEmail().then((email) => email && setWakaEmail(email));
  }, []);

  const tabs = [
    {
      name: "📮",
      path: "signpost",
      component: <SignPost session={session} wakaToken={wakaToken} email={wakaEmail} />,
    },
    {
      name: "The Keep",
      path: "the-keep",
      component: <Shipyard ships={myShips} />,
      lockOnNoHb: true,
    },
    {
      name: "Thunderdome",
      path: "thunderdome",
      component: <Battles session={session} />,
      lockOnNoHb: true
    },
    {
      name: "Shoppe",
      path: "shop",
      component: <Shop items={shopItems} />
    },
  ];

  return (
          <Tabs
            value={currentTab}
            className="flex-1 flex flex-col"
            onValueChange={handleTabChange}
          >
            <TabsList className="mx-2 my-2 relative">
              {tabs.map((tab) =>
                tab.name === "📮" ? (
                  <TabsTrigger
                    className="left-px absolute"
                    key={tab.name}
                    value={tab.path}
                  >
                    <Image src={SignpostImage} width={20} alt="" />
                  </TabsTrigger>
                ) : (
                  <TabsTrigger key={tab.name} value={tab.path}>
                    {tab.name}
                  </TabsTrigger>
                ),
              )}
              <div className="right-px absolute mr-2 text-green-400">
                <div className="flex flex-row">
                  <img src="scales.svg" alt="scales" width={25} height={25} />
                  <span className="mr-2">{personTicketBalance} Scales</span>
                </div>
              </div>
            </TabsList>
            <div
              className="flex-1 overflow-auto p-3"
              id="harbour-tab-scroll-element"
            >
              {tabs.map((tab) => (
                <TabsContent key={tab.name} value={tab.path} className="h-full">
                  {tab.lockOnNoHb && !hasWakaHb ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-lg text-center gap-4">
                      <Icon glyph="private-outline" width={42} />
                      <p>
                        {"We haven't seen any "}
                        <Link
                          className="text-blue-500"
                          href={"https://waka.hackclub.com"}
                        >
                          WakaTime
                        </Link>{" "}
                        activity from you yet.
                        <br />
                        {tab.name} will unlock once we see you{"'"}ve set it up.
                        Once you{"'"}ve been coding for a couple of minutes,
                        refresh this page. If you have already used hackatime dm{" "}
                        <a href="https://hackclub.slack.com/team/U062UG485EE">
                          @krn
                        </a>{" "}
                        and he will migrate your acount :)
                      </p>

                      <Button
                        disabled={!wakaToken}
                        onClick={() => {
                          navigator.clipboard.writeText(wakaToken!);
                          toast({
                            title: "Copied WakaTime token",
                            description: wakaToken,
                          });
                        }}
                      >
                        Copy WakaTime token
                      </Button>

                      <Button
                        className={`text-black ${buttonVariants({ variant: "outline" })}`}
                        onClick={() => setHasWakaHb(true)}
                      >
                        Skip WakaTime setup requirement
                      </Button>
                    </div>
                  ) : (
                    tab.component
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
  );
}
