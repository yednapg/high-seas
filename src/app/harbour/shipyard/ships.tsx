import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Ship, stagedToShipped } from "./ship-utils";
import Image from "next/image";
import Icon from "@hackclub/icons";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "@/components/markdown";
import { Button, buttonVariants } from "@/components/ui/button";
import NewShipForm from "./new-ship-form";
import EditShipForm from "./edit-ship-form";
import { getSession } from "@/app/utils/auth";
import { JwtPayload } from "jsonwebtoken";
import Link from "next/link";

import ScalesImage from "/public/scales.svg";

export default function Ships({
  ships,
  bareShips = false,
  setShips,
}: {
  ships: Ship[];
  bareShips: boolean;
  setShips: any;
}) {
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [previousSelectedShip, setPreviousSelectedShip] = useState<Ship | null>(
    null,
  );

  const [readmeText, setReadmeText] = useState<string | null>(null);
  const [newShipVisible, setNewShipVisible] = useState(false);
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
        setReadmeText(
          `Failed to load README content from ${selectedShip.readmeUrl}`,
        );
      }
    }
  };

  const stagedShips = ships.filter(
    (ship: Ship) => ship.shipStatus === "staged",
  );
  const shippedShips = ships.filter(
    (ship: Ship) => ship.shipStatus === "shipped",
  );

  const SingleShip = ({ s }: { s: Ship }) => (
    <motion.div
      key={s.id}
      onClick={() => setSelectedShip(s)}
      className="cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="flex items-center p-4 hover:bg-gray-100 transition-colors duration-200">
        <div className="w-16 h-16 relative mr-4">
          <img
            src={s.screenshotUrl}
            alt={`Screenshot of ${s.title}`}
            style={{ objectFit: "cover" }}
            className="object-cover max-w-full rounded-md"
            sizes="4rem"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-left">{s.title}</h2>
          <div className="flex items-center gap-6 text-sm text-gray-600 mt-1">
            {s.shipStatus === "shipped" &&
              (s.voteRequirementMet ? (
                s.doubloonPayout ? (
                  <div className="flex gap-1 items-center text-green-500">
                    <Image
                      src={ScalesImage}
                      alt="scales"
                      width={25}
                      height={25}
                    />
                    {s.doubloonPayout} Scales
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-blue-400">
                    <Icon glyph="event-add" size={24} />
                    {"Pending: hang tight- we're counting the votes!"}
                  </div>
                )
              ) : (
                <div className="flex items-center gap-1 text-blue-500">
                  <Icon glyph="enter" size={24} />
                  Pending: Vote to unlock
                </div>
              ))}
            <div className="flex items-center gap-1">
              <Icon glyph="clock" size={24} /> {s.hours} hr
            </div>
          </div>
        </div>

        {s.shipStatus === "staged" ? (
          <div className="ml-auto">
            <Button
              onClick={async (e) => {
                e.stopPropagation();
                console.log("Shippingg", s);
                await stagedToShipped(s);
                location.reload();
              }}
            >
              YEET SHIP
            </Button>
          </div>
        ) : null}
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
              <SingleShip s={ship} key={ship.id} />
            ))}
          </div>
        </div>
      )}

      {shippedShips.length === 0 ? null : (
        <div className={`w-full ${bareShips ? "" : "mb-10"}`}>
          {bareShips ? null : (
            <h2 className="text-center text-2xl mb-2 text-blue-500">
              Shipped Ships
            </h2>
          )}

          <div className="space-y-4">
            {shippedShips.length === 0 ? (
              <div>
                <p>No Ships yet!</p>
              </div>
            ) : (
              shippedShips.map((ship: Ship, idx: number) => (
                <SingleShip s={ship} key={ship.id} />
              ))
            )}
          </div>
        </div>
      )}

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
              className="relative w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <NewShipForm
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
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                </div>

                <div className="overflow-y-auto flex-grow pt-48">
                  <CardHeader className="relative">
                    <h2 className="text-3xl font-bold">{selectedShip.title}</h2>
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
                              transform: "translate(0, -2rem)",
                              scale: 0.0,
                            }}
                            animate={{
                              opacity: 1,
                              transform: "translate(0, 0rem)",
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              transform: "translate(0, 2rem)",
                              scale: 5,
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

                      <motion.div className="flex items-center gap-6 text-lg mt-4">
                        <div className="flex gap-1 items-center text-green-500">
                          <Image
                            src={ScalesImage}
                            alt="scales"
                            width={25}
                            height={25}
                          />
                          {selectedShip.doubloonPayout} Scales
                        </div>

                        <div className="flex gap-1 items-center text-blue-600">
                          <Icon glyph="clock" /> {selectedShip.hours} hours
                        </div>
                      </motion.div>

                      <hr className="my-5" />

                      {readmeText ? (
                        <div className="prose max-w-none">
                          <ReactMarkdown components={markdownComponents}>
                            {readmeText}
                          </ReactMarkdown>
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
