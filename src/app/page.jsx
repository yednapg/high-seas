"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import Shipyard from "./shipyard/page";

const pages = {
  shipyard: <Shipyard />,
  battles: <Shipyard />,
  map: <Shipyard />,
  shop: <Shipyard />,
  events: <Shipyard />,
};

export default function PirateEventHomepage() {
  const [activePage, setActivePage] = useState("shipyard");
  const [pageOrder, setPageOrder] = useState(Object.keys(pages));

  useEffect(() => {
    const activeIndex = pageOrder.indexOf(activePage);
    const newOrder = [
      activePage,
      ...pageOrder.slice(0, activeIndex),
      ...pageOrder.slice(activeIndex + 1),
    ];
    setPageOrder(newOrder);
  }, [activePage, pageOrder]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "url('/bg.png')",
      }}
    >
      <div className="relative max-w-7xl w-full">
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
                  scale: 1 - index * 0.05,
                  zIndex: Object.keys(pages).length - index,
                  y: index * -40,
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
                className="absolute inset-0 rounded-lg shadow-xl overflow-hidden bg-[#338FAB]"
                style={{
                  transformOrigin: "center center",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 bg-[#59D3DD] text-[#F7F9B6] px-4 py-1 cursor-pointer capitalize text-xl font-black"
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </div>
                <div className="p-8 pt-16">{pages[page]}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
