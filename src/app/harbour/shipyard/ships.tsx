import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Ship } from "./ship-utils";
import Image from "next/image";
import Icon from "@hackclub/icons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Ships({ ships }: { ships: Ship[] }) {
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [readmeText, setReadmeText] = useState<string | null>(null);
  const [isMarkdownExpanded, setIsMarkdownExpanded] = useState(false);
  const [isCardContentLoaded, setIsCardContentLoaded] = useState(false);

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

  return (
    <>
      <div className="container mx-auto p-4">
        <motion.div layout className="space-y-4">
          {ships.map((ship: Ship) => (
            <motion.div
              key={ship.id}
              layoutId={ship.id}
              onClick={() => setSelectedShip(ship)}
              className="cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="flex items-center p-4 hover:bg-gray-100 transition-colors duration-200">
                <div className="w-16 h-16 relative mr-4">
                  <Image
                    src={ship.screenshotUrl}
                    alt={`Screenshot of ${ship.title}`}
                    layout={"fill"}
                    sizes="4rem"
                    objectFit={"cover"}
                    className="rounded-md"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{ship.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Icon glyph="payment" size={24} /> {ship.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon glyph="clock" size={24} /> {ship.hours}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

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
                    layout={"fill"}
                    sizes="4rem"
                    objectFit={"cover"}
                    priority
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
                          <div className="flex items-center text-yellow-600 font-semibold">
                            <Icon glyph="payment" /> {selectedShip.rating}{" "}
                            doubloons
                          </div>

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
                            {/* <Github className="w-5 h-5 mr-1" /> Repository */}
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
