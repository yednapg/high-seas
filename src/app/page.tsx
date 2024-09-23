"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const pages = ["shipyard", "battles", "map", "shop", "events"];

export default function PirateEventHomepage() {
  const [activePage, setActivePage] = useState(pages[0]);
  const [pageOrder, setPageOrder] = useState(pages);

  useEffect(() => {
    const activeIndex = pageOrder.indexOf(activePage);
    const newOrder = [
      activePage,
      ...pageOrder.slice(0, activeIndex),
      ...pageOrder.slice(activeIndex + 1),
    ];
    setPageOrder(newOrder);
  }, [activePage]); // eslint-disable-line

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center pb-12 px-8 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/bg.svg')",
      }}
    >
      <div className="relative max-w-7xl w-full space-y-8">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center drop-shadow-lg relative z-50 pointer-events-none"
        >
          <Image
            src="/logo.png"
            alt="high seas logo"
            width={350}
            height={0}
            className="mx-auto"
          />
        </motion.h1>
        <div className="relative h-[600px]">
          <AnimatePresence>
            {pageOrder.map((page, index) => (
              <motion.div
                key={page}
                initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  rotate: index * 2,
                  scale: 1 - index * 0.1,
                  zIndex: pages.length - index,
                  y: index * -50,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.1,
                  y: 50,
                  transition: { duration: 0.3, ease: "easeInOut" },
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-lg shadow-xl overflow-hidden"
                style={{
                  transformOrigin: "center center",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  backgroundImage: "url(/paper.png)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 bg-yellow-900 text-yellow-100 px-4 py-2 cursor-pointer capitalize font-blackpearl"
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </div>
                <div className="p-8 pt-16">
                  <h2 className="text-2xl font-bold mb-4 text-yellow-900">
                    {page}
                  </h2>
                  <p className="whitespace-pre-line text-yellow-950">{page}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
