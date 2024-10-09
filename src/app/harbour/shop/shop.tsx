import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SoundButton } from "./sound-button.js";
import { LoadingSpinner } from "@/components/ui/loading_spinner.js";
import { sample, shopBanner } from "../../../../lib/flavor.js";
import { useState, useEffect } from "react";
import Image from "next/image";
import scales from "/public/scales.svg";
import useLocalStorage from "../../../../lib/useLocalStorage.js";

export default function Shop({ items }: any) {
  const [filterIndex, setFilterIndex] = useLocalStorage("shop.country.filter", 0)
  const [bannerText, setBannerText] = useState('')
  useEffect(() => {
    setBannerText(sample(shopBanner))
  }, [])

  if (!items) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  const filters = {
    '0': (x: any) => { return true },
    '1': (item: any) => item.enabledUs,
    '2': (item: any) => item.enabledEu,
    '3': (item: any) => item.enabledIn,
    '4': (item: any) => item.enabledXx,
  }
  const getFilter = () => {
    // @ts-expect-error reason reason reason
    return filters[(filterIndex.toString())] || filters['0']
  }

  const onOptionChangeHandler = (e) => {
    setFilterIndex(e.target.value)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <SoundButton />

      <div className="text-center">
      <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-300 mb-4">
        Ye olde shoppe
      </h1>
        <p className="text-xl animate-pulse mb-6 rotate-[-7deg] inline-block">{bannerText}</p>
      </div>
      <div className="text-center mb-6 mt-12">
        <label>Choose your region: </label>
        <select onChange={onOptionChangeHandler} value={filterIndex}>
          <option value="0">All items</option>
          <option value="1">US</option>
          <option value="2">EU</option>
          <option value="3">India</option>
          <option value="4">Other countries worldwide</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.filter(getFilter()).map((item: any) => (
          <motion.div key={item.id} whileHover={{ scale: 1.05 }}>
            <Card className="h-full">
              <CardHeader>

                <span style={{alignSelf: "end"}} className="text-green-400">
                  <Image src={scales} alt="scales" width={25} height={25} style={{display: "inline-block"}}/>
                  {filterIndex == 1 ? item.priceUs : item.priceGlobal}
                </span>
                <div>
                <CardTitle>{item.name}</CardTitle>
                <p className="text-sm text-gray-600">{item.subtitle || ""}</p>
                </div>

              </CardHeader>
              {item.imageUrl && (
                <CardContent>
                  <img src={item.imageUrl} alt={item.name} className="w-full" />
                </CardContent>
              )}
              <form action={`/api/buy/${item.id}`} method="POST">
                <Button>Buy</Button>
              </form>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
