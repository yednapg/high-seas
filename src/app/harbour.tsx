"use client";
import SignOut from "@/components/sign_out";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Shipyard from "./shipyard/page";
import Battles from "./battles/page";
import Shop from "./shop/page";
import { useEffect, useState } from "react";
import { getShop, ShopItem } from "./shop/shop-utils";
import Map from "./map/page";
import { getShips, Ship } from "./shipyard/ship-utils";

export default function Harbour({ session }) {
  const [ships, setShips] = useState<Ship[] | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[] | null>(null);

  useEffect(() => {
    (async () => {
      console.log(session.payload.sub);
      setShips(await getShips(session.payload.sub));
      setShopItems(await getShop());
    })();
  }, []);

  const tabs = [
    { name: "Shipyard", component: <Shipyard ships={ships} /> },
    { name: "Battles", component: <Battles /> },
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
            <div className="flex-1 overflow-auto px-3 pb-3">
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
