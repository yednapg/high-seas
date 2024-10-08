import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Ship } from "./ship-utils";
import Image from "next/image";
import Icon from "@hackclub/icons";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "@/components/markdown";
import remarkGfm from "remark-gfm";
import { Button, buttonVariants } from "@/components/ui/button";
import NewShipForm from "./new-ship-form";
import { getSession } from "@/app/utils/auth";
import { JwtPayload } from "jsonwebtoken";
import Link from "next/link";

import ScalesImage from "/public/scales.svg";

export default function Ships({ ships }: { ships: Ship[] }) {
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [readmeText, setReadmeText] = useState<string | null>(null);
  const [newShipVisible, setNewShipVisible] = useState(false);
  const [session, setSession] = useState<JwtPayload | null>(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setReadmeText(null);

    fetchReadme();

    getSession().then((sesh) => setSession(sesh));
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

  const SingleShip = ({ s }: { s: Ship }) => (
    <motion.div
      key={s.id}
      layoutId={s.id}
      onClick={() => setSelectedShip(s)}
      className="cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="flex items-center p-4 hover:bg-gray-100 transition-colors duration-200">
        <div className="w-16 h-16 relative mr-4">
          <img
            src={s.screenshotUrl}
            alt={`s of ${s.title}`}
            style={{objectFit: "cover"}}
            className="object-cover max-w-full max-h-full rounded-md"
            sizes="4rem"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{s.title}</h2>
          <div className="flex items-center gap-6 text-sm text-gray-600 mt-1">
            {s.voteRequirementMet ? (
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
                  <Icon glyph="event-add" size={24} />{" "}
                  {"Pending: hang tight– we're counting the votes!"}
                </div>
              )
            ) : (
              <div className="flex items-center gap-1 text-blue-500">
                <Icon glyph="event-add" size={24} /> Pending: vote in the
                Thunderdome!
              </div>
            )}
            <div className="flex items-center gap-1">
              <Icon glyph="clock" size={24} /> {s.hours} hr
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed w-screen h-screen left-0 top-0 pointer-events-none"
      />

      <div className="container mx-auto p-4 text-center">
        <motion.div layout className="space-y-4">
          {ships.length === 0 ? (
            <p className="text-center mb-4">
              <b>{"You don't have any ships yet."}</b>
            </p>
          ) : (
            ships.map((ship: Ship, idx: number) => (
              <SingleShip s={ship} key={idx} />
            ))
          )}
        </motion.div>

        <Button
          className="mt-6 w-full"
          onClick={() => setNewShipVisible(true)}
        >
          New Ship
        </Button>
      </div>

      <AnimatePresence>
        {newShipVisible && session && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
          </motion.div>
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
              layoutId={selectedShip.id}
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
                      <div className="flex gap-3">
                        <Link
                          className={`${buttonVariants({ variant: "default" })} h-12 flex-grow`}
                          href={
                            selectedShip.deploymentUrl || "https://google.com"
                          }
                          prefetch={false}
                        >
                          Play
                          <Icon glyph="view-forward" />
                        </Link>

                        <Link
                          className={`${buttonVariants({ variant: "outline" })} h-12`}
                          href={selectedShip.repoUrl}
                          prefetch={false}
                        >
                          <Icon glyph="github" />
                          GitHub Repo
                        </Link>
                      </div>

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

                          {/*<Markdown remarkPlugins={[remarkGfm]}>
                              {readmeText}
                            </Markdown>*/}
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
