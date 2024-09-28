"use client";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Shipyard from "./shipyard/page";
import Battles from "./battles/page";
import Shop from "./shop/page";
import { useEffect, useState } from "react";
import { getShop, ShopItem } from "./shop/shop-utils";
import Map from "./map/page";
import { getUserShips, Ship } from "./shipyard/ship-utils";
import Gallery, { ShipsObject } from "./gallery/page";
import { JwtPayload } from "jsonwebtoken";

export default function Harbour({ session }: { session: JwtPayload }) {
  // All the content management for all the tabs goes here.
  const [myShips, setMyShips] = useState<Ship[] | null>(null);
  const [galleryShips, setGalleryShips] = useState<ShipsObject>({});
  const [shopItems, setShopItems] = useState<ShopItem[] | null>(null);

  useEffect(() => {
    (async () => {
      setMyShips(await getUserShips(session.payload.sub));
      setShopItems(await getShop());
    })();
  }, []);

  useEffect(() => {}, [galleryShips]);

  const tabs = [
    { name: "Shipyard", component: <Shipyard ships={myShips} /> },
    { name: "Battles", component: <Battles /> },
    {
      name: "Gallery",
      component: <Gallery ships={galleryShips} setShips={setGalleryShips} />,
    },
    { name: "Map", component: <Map /> },
    { name: "Shop", component: <Shop items={shopItems} /> },
  ];

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      style={{ backgroundImage: "url(/bg.svg)" }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full h-full flex items-center justify-center p-8"
      >
        <Card className="w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
          <Tabs
            defaultValue="Shipyard"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="mx-3 my-3">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.name} value={tab.name}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div
              className="flex-1 overflow-auto p-3"
              id="harbour-tab-scroll-element"
            >
              {tabs.map((tab) => (
                <TabsContent key={tab.name} value={tab.name} className="h-full">
                  {tab.component}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}
