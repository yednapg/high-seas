import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Ship } from "./ship-utils";
import Image from "next/image";
import Icon from "@hackclub/icons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import NewShipForm from "./new-ship-form";

export default function Ships({ ships }: { ships: Ship[] }) {
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [readmeText, setReadmeText] = useState<string | null>(null);
  const [isMarkdownExpanded, setIsMarkdownExpanded] = useState(false);
  const [isCardContentLoaded, setIsCardContentLoaded] = useState(false);
  const [newShipVisible, setNewShipVisible] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setReadmeText(null);
    setIsMarkdownExpanded(false);
    setIsCardContentLoaded(false);
  }, [selectedShip]);

  useEffect(() => {
    if (selectedShip) {
      setTimeout(() => {
        setIsCardContentLoaded(true);
      }, 500);
    }
  }, [selectedShip]);

  const fetchReadme = async () => {
    if (selectedShip && !readmeText) {
      try {
        const res = await fetch(selectedShip.readmeUrl);
        const text = await res.text();
        setReadmeText(text);
      } catch (error) {
        console.error("Failed to fetch README:", error);
        setReadmeText("Failed to load README content.");
      }
    }
  };

  const handleMarkdownToggle = () => {
    setIsMarkdownExpanded(!isMarkdownExpanded);
    if (!readmeText) {
      fetchReadme();
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
          <Image
            src={s.screenshotUrl}
            alt={`s of ${s.title}`}
            layout={"fill"}
            className="object-cover max-w-full rounded-md"
            sizes="4rem"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{s.title}</h2>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {s.voteRequirementMet ? (
              s.doubloonPayout ? (
                <div className="flex items-center gap-1 text-green-400">
                  <Icon glyph="payment" size={24} /> {s.doubloonPayout} scales
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
              <Icon glyph="clock" size={24} /> {s.hours}
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

      <div className="container mx-auto p-4">
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

        <Button className="w-full" onClick={() => setNewShipVisible(true)}>
          New Ship
        </Button>
      </div>

      <AnimatePresence>
        {newShipVisible && (
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
                    layout={"fill"}
                    priority
                    sizes="4rem"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                </div>

                <div className="overflow-y-auto flex-grow pt-48">
                  <CardHeader className="relative">
                    <h2 className="text-3xl font-bold">{selectedShip.title}</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isCardContentLoaded ? (
                      <>
                        <motion.div className="flex items-center gap-4">
                          <div className="flex items-center text-blue-600 font-semibold">
                            <Icon glyph="clock" /> {selectedShip.hours} hours
                          </div>
                        </motion.div>
                        <motion.div className="flex space-x-4">
                          <a
                            href={selectedShip.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:underline"
                          >
                            <Icon glyph="github" /> Repo
                          </a>
                        </motion.div>

                        <motion.div className="mt-4">
                          <button
                            onClick={handleMarkdownToggle}
                            className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                          >
                            <span className="font-medium inline-flex gap-2 items-center">
                              <Icon glyph="docs" /> Project README
                            </span>
                            {isMarkdownExpanded ? (
                              <Icon glyph="up-caret" />
                            ) : (
                              <Icon glyph="down-caret" />
                            )}
                          </button>
                          <AnimatePresence>
                            {isMarkdownExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {readmeText ? (
                                  <Markdown remarkPlugins={[remarkGfm]}>
                                    {readmeText}
                                  </Markdown>
                                ) : (
                                  <p className="text-center">
                                    Loading README...
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </>
                    ) : (
                      <p className="text-center">Loading content...</p>
                    )}
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
