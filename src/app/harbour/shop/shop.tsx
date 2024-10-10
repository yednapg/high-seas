import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading_spinner";
import { sample, shopBanner } from "../../../../lib/flavor.js";
import { useState, useEffect, useMemo } from "react";
import { getShop } from "./shop-utils"
import useLocalStorageState from "../../../../lib/useLocalStorageState.js";

export default function Shop() {
  const [filterIndex, setFilterIndex] = useLocalStorageState("shop.country.filter", 0)
  const [shopItems, setShopItems] = useLocalStorageState<ShopItem[] | null>('cache.shopItems', null);
  const [bannerText, setBannerText] = useState('')
  useEffect(() => {
    setBannerText(sample(shopBanner))

    getShop().then((shop) => setShopItems(shop));
  }, [])

  const styles = useMemo(() => ({
    cardHoverProps: {
      whileHover: { scale: 1.05 }
    },
    imageStyle: {
      display: "inline-block"
    }
  }), [])

  if (!shopItems) {
    return (
      <motion.div
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
      className="container mx-auto px-4 py-8"
    >

      <div className="text-center">
      <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-300 mb-4">
        Ye olde shoppe
      </h1>
        <p className="text-xl animate-pulse mb-6 rotate-[-7deg] inline-block">{bannerText}</p>
      </div>
      <div className="text-center mb-6 mt-12">
        <label>pick a region to buy something! </label>
        <select onChange={onOptionChangeHandler} value={filterIndex}>
          <option value="0">all regions</option>
          <option value="1">US</option>
          <option value="2">EU</option>
          <option value="3">India</option>
          <option value="4">other countries worldwide</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.filter(getFilter()).map((item: any) => (
          <motion.div key={item.id} {...styles.cardHoverProps}>
            <Card className="h-full">
              <CardHeader>

                <span style={{ alignSelf: "end" }} className="text-green-400">
                  <img src="scales.svg" alt="scales" width={25} height={25} style={styles.imageStyle} />
                  {filterIndex == 1 ? item.priceUs : item.priceGlobal}
                </span>
                <div>
                <CardTitle>{item.name}{item.fulfilledAtEnd && "*"}</CardTitle>
                <p className="text-sm text-gray-600">{item.subtitle || ""}</p>
                </div>

              </CardHeader>
              {item.imageUrl && (
                <CardContent>
                  <img src={item.imageUrl} alt={item.name} className="w-full" />
                </CardContent>
              )}
              {filterIndex != 0 &&
                  (<form action={`/api/buy/${item.id}`} method="POST">
                <Button>Buy</Button>
              </form> )}
            </Card>
          </motion.div>
        ))}

      </div>
      <div className="text-center mb-6 mt-12">
        <label>Items marked with * will ship out after the event concludes.</label>
      </div>
    </motion.div>
  );
}
