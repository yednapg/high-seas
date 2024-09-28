"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Ship } from "./ship-utils";
import Image from "next/image";
import { X, Star, Clock, Github, FileText } from "lucide-react";
import Markdown from "react-markdown";

export default async function Ships({ ships }: { ships: Ship[] }) {
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);

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
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-1" /> {ship.rating}
                    <Clock className="w-4 h-4 ml-4 mr-1" /> {ship.hours} hours
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
              className="bg-white rounded-lg w-full max-w-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="relative">
                <motion.div
                  className="absolute -top-px -left-px -right-px h-48 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Image
                    src={selectedShip.screenshotUrl}
                    alt={`Screenshot of ${selectedShip.title}`}
                    layout={"fill"}
                    sizes="4rem"
                    objectFit={"cover"}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                </motion.div>
                <CardHeader className="relative pt-52">
                  <motion.h2 className="text-3xl font-bold">
                    {selectedShip.title}
                  </motion.h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-1" />
                      <span className="font-semibold">
                        {selectedShip.rating}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-500 mr-1" />
                      <span>{selectedShip.hours} hours</span>
                    </div>
                  </motion.div>
                  <motion.div className="flex space-x-4">
                    <a
                      href={selectedShip.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Github className="w-5 h-5 mr-1" /> Repository
                    </a>
                    <a
                      href={selectedShip.readmeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <FileText className="w-5 h-5 mr-1" /> README
                    </a>
                  </motion.div>

                  <motion.p className="text-gray-600">
                    <Markdown>
                      {await fetch(selectedShip.readmeUrl).then((a) =>
                        a.text(),
                      )}
                    </Markdown>
                  </motion.p>
                </CardContent>
                <motion.button
                  className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md"
                  onClick={() => setSelectedShip(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-gray-600" />
                </motion.button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
