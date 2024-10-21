import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Ship, stagedToShipped } from "./ship-utils";
import Image from "next/image";
import Icon from "@hackclub/icons";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { markdownComponents } from "@/components/markdown";
import { Button, buttonVariants } from "@/components/ui/button";
import NewShipForm from "./new-ship-form";
import EditShipForm from "./edit-ship-form";
import { getSession } from "@/app/utils/auth";
import { JwtPayload } from "jsonwebtoken";
import Link from "next/link";

import ScalesImage from "/public/scales.svg";
import Pill from "@/components/ui/pill";
import ShipPillCluster from "@/components/ui/ship-pill-cluster";
import NoImgDino from "/public/no-img-dino.png";
import NoImgBanner from "/public/no-img-banner.png";
import ReadmeHelperImg from "/public/readme-helper.png";
import NewUpdateForm from "./new-update-form";

function ago(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const count = Math.floor(diffInSeconds / interval.seconds);

    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export default function Ships({
  ships,
  shipChains,
  bareShips = false,
  setShips,
}: {
  ships: Ship[];
  shipChains: Map<string, string[]>;
  bareShips: boolean;
  setShips: any;
}) {
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [previousSelectedShip, setPreviousSelectedShip] = useState<Ship | null>(
    null,
  );

  const [readmeText, setReadmeText] = useState<string | null>(null);
  const [newShipVisible, setNewShipVisible] = useState(false);
  const [newUpdateShip, setNewUpdateShip] = useState<Ship | null>(null);
  const [session, setSession] = useState<JwtPayload | null>(null);
  const [isEditingShip, setIsEditingShip] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setSelectedShip((s: Ship | null) => {
      if (!s) return null;
      return ships.find((x) => x.id === s.id) || null;
    });
  }, [ships]);

  useEffect(() => {
    getSession().then((sesh) => setSession(sesh));
  }, []);

  useEffect(() => {
    // I.e. if the user has just edited a ship
    if (previousSelectedShip && selectedShip) return;

    // Only invalidate the README text when you go from <<ship selected>> to <<no ship selected>>
    if (!selectedShip) {
      setReadmeText(null);
      setIsEditingShip(false);
    }

    if (selectedShip) {
      fetchReadme();
    }

    setPreviousSelectedShip(selectedShip);
  }, [selectedShip]);

  const fetchReadme = async () => {
    if (selectedShip && !readmeText) {
      try {
        const text = await fetch(selectedShip.readmeUrl).then((d) => d.text());
        setReadmeText(text);
      } catch (error) {
        console.error("Failed to fetch README:", error);
        setReadmeText("?");
      }
    }
  };

  const stagedShips = ships.filter(
    (ship: Ship) => ship.shipStatus === "staged",
  );
  const shippedShips = ships.filter(
    (ship: Ship) => ship.shipStatus === "shipped",
  );

  const shipMap = new Map();
  ships.forEach((s: Ship) => shipMap.set(s.id, s));

  const SingleShip = ({
    s,
    bareShips,
    setNewShipVisible,
  }: {
    s: Ship;
    bareShips: boolean;
    setNewShipVisible: any;
  }) => (
    <motion.div
      key={s.id}
      onClick={() => setSelectedShip(s)}
      className="cursor-pointer"
      whileHover={{ rotate: "3deg" }}
      whileTap={{ rotate: "-2deg" }}
    >
      <Card className="flex flex-col sm:gap-2 sm:flex-row items-start sm:items-center p-4 hover:bg-gray-100 transition-colors duration-200">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 relative mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
            <img
              src={s.screenshotUrl}
              alt={`Screenshot of ${s.title}`}
              className="object-cover w-full h-full absolute top-0 left-0 rounded"
              onError={({ target }) => {
                target.src = NoImgDino.src;
              }}
            />
          </div>
          <h2 className="text-xl font-semibold text-left mb-2 sm:hidden block">
            {s.title}
          </h2>
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-left mb-2 sm:block hidden">
            {s.title}
          </h2>

          <div className="flex flex-wrap items-start gap-2 text-sm">
            <ShipPillCluster ship={s} />
          </div>
        </div>

        {!bareShips && (
          <div className="mt-4 sm:mt-0 sm:ml-auto">
            {s.shipStatus === "staged" ? (
              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  console.log("Shipping", s);
                  await stagedToShipped(s);
                  location.reload();
                }}
              >
                SHIP SHIP!
              </Button>
            ) : (
              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  console.log("Shipping an update...", s);
                  setNewUpdateShip(s);
                  // await stagedToShipped(s);
                  // location.reload();
                }}
              >
                Ship an update!
              </Button>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed w-screen h-screen left-0 top-0 pointer-events-none"
      />

      {bareShips ? null : (
        <motion.div
          className="w-fit mx-auto mb-10 mt-3"
          whileHover={{ rotate: "-5deg", scale: 1.02 }}
        >
          <Button className="text-xl" onClick={() => setNewShipVisible(true)}>
            Draft a new Ship!
          </Button>
        </motion.div>
      )}

      {stagedShips.length === 0 ? null : (
        <div className={`w-full ${bareShips ? "" : "mb-10"}`}>
          {bareShips ? null : (
            <h2 className="text-center text-2xl mb-2 text-blue-500">
              Draft Ships
            </h2>
          )}

          <div className="space-y-4">
            {stagedShips.map((ship: Ship, idx: number) => (
              <SingleShip
                s={ship}
                key={ship.id}
                setNewShipVisible={setNewShipVisible}
              />
            ))}
          </div>
        </div>
      )}

      <div className={`w-full ${bareShips ? "" : "mb-10"}`}>
        {bareShips ? null : (
          <h2 className="text-center text-2xl mb-2 text-blue-500">
            Shipped Ships
          </h2>
        )}

        <div className="space-y-4">
          {shippedShips.length === 0 ? (
            <div className="mx-auto w-fit">
              <p className="text-center mb-3">No Ships yet!</p>
              <img src="/dino_debugging.svg" alt="" width="100" />
            </div>
          ) : (
            shippedShips.map((ship: Ship, idx: number) => (
              <SingleShip
                s={ship}
                key={ship.id}
                setNewShipVisible={setNewShipVisible}
              />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {newShipVisible && session && (
          <div
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setNewShipVisible(false)}
          >
            <Card
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <NewShipForm
                ships={ships}
                canvasRef={canvasRef}
                closeForm={() => setNewShipVisible(false)}
                session={session}
              />

              <motion.button
                className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md z-20"
                onClick={() => setNewShipVisible(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon glyph="view-close" />
              </motion.button>
            </Card>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {newUpdateShip && session && (
          <div
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setNewUpdateShip(null)}
          >
            <Card
              className="relative w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <NewUpdateForm
                shipToUpdate={newUpdateShip}
                canvasRef={canvasRef}
                closeForm={() => setNewUpdateShip(null)}
                session={session}
              />

              <motion.button
                className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md z-20"
                onClick={() => setNewUpdateShip(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon glyph="view-close" />
              </motion.button>
            </Card>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedShip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedShip(null)}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="relative h-[80vh] overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-48 z-10">
                  <Image
                    src={selectedShip.screenshotUrl}
                    alt={`Screenshot of ${selectedShip.title}`}
                    className="object-cover max-w-full"
                    fill={true}
                    priority
                    unoptimized
                    sizes="4rem"
                    onError={({ target }) => {
                      target.src = NoImgBanner.src;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                </div>

                <div className="overflow-y-auto flex-grow pt-48">
                  <CardHeader className="relative">
                    <h2 className="text-3xl font-bold">{selectedShip.title}</h2>
                    <p className="opacity-50">
                      {selectedShip.wakatimeProjectName ? (
                        `Wakatime project name: ${selectedShip.wakatimeProjectName}`
                      ) : (
                        <div className="flex items-center gap-1">
                          <Icon glyph="important" />
                          No Wakatime project name!
                        </div>
                      )}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex flex-row gap-3 h-12">
                        <Button
                          className="flex-grow h-full"
                          disabled={!selectedShip.deploymentUrl}
                        >
                          <Link
                            className="flex items-center"
                            href={selectedShip.deploymentUrl || "#"}
                            prefetch={false}
                          >
                            Play
                            <Icon glyph="view-forward" />
                          </Link>
                        </Button>

                        <Link
                          className={`${buttonVariants({ variant: "outline" })} h-full`}
                          href={selectedShip.repoUrl}
                          prefetch={false}
                        >
                          <Icon glyph="github" /> GitHub Repo
                        </Link>

                        <Button
                          className={`${buttonVariants({ variant: "outline" })} w-fit p-2 h-full text-black`}
                          onClick={() => setIsEditingShip((p) => !p)}
                        >
                          <Icon glyph="edit" width={24} /> Edit
                        </Button>
                      </div>

                      <AnimatePresence>
                        {isEditingShip && selectedShip && (
                          <motion.div
                            key="edit-ship-form"
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: "fit-content",
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                          >
                            <Card className="p-2 mt-2 bg-neutral-100">
                              <EditShipForm
                                ship={selectedShip}
                                closeForm={() => setIsEditingShip(false)}
                                setShips={setShips}
                              />
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div className="flex items-center gap-4 mt-4">
                        <ShipPillCluster ship={selectedShip} />
                      </motion.div>

                      <div onClick={() => console.log(shipChains)}>
                        {shipChains}
                        {/* {selectedShip.shipIdChain.length}
                        {selectedShip.shipIdChain.map((sid: string, idx) => (
                          <p key={idx}>
                            {shipMap.get(sid).title} ({shipMap.get(sid).id}){" "}
                            {ago(new Date(shipMap.get(sid).createdTime))}
                          </p>
                        ))} */}
                      </div>

                      {selectedShip.shipType === "update" ? (
                        <>
                          <hr className="my-5" />
                          <div>
                            <h3 className="text-xl">Update description</h3>
                            <p>{selectedShip.updateDescription}</p>
                          </div>
                        </>
                      ) : null}

                      <hr className="my-5" />

                      {readmeText ? (
                        <div className="prose max-w-none">
                          {readmeText === "?" ? (
                            <div className="p-2 text-center">
                              <p>RAHHHH! You entered a bad README URL.</p>
                              <p className="text-xs">
                                Bestie you gotta click <code>Raw</code> on your
                                README and then copy the URL
                                <br />
                                (it should start with{" "}
                                <code>raw.githubusercontent.com</code> and end
                                in <code>.md</code>)
                              </p>
                              <Image
                                src={ReadmeHelperImg}
                                alt=""
                                width={400}
                                height={100}
                                className="mx-auto object-cover mt-2"
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="text-xl">Main Project README</h3>
                              <ReactMarkdown
                                components={markdownComponents}
                                rehypePlugins={[rehypeRaw]}
                              >
                                {readmeText}
                              </ReactMarkdown>
                            </>
                          )}
                        </div>
                      ) : (
                        <p className="text-center">Loading README...</p>
                      )}
                    </div>
                  </CardContent>
                </div>

                <motion.button
                  className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md z-20"
                  onClick={() => setSelectedShip(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon glyph="view-close" />
                </motion.button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
