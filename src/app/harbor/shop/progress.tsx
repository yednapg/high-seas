// harbor/shop/progress.tsx

import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export default function Progress({ val, items }) {
  const currentTix = Number(Cookies.get('tickets') ?? 0)
  let favItems = items.filter((item) => val.includes(item.id))
  console.log(favItems)
  let max = favItems.sort(
    (a: ShopItem, b: ShopItem) => b.priceGlobal - a.priceGlobal,
  )[0]
  if (!max) {
    return null
  }
  useEffect(() => {
    localStorage.setItem('favouriteItems', JSON.stringify(val))
  }, [val])
  /*let favItems = favItems.map((item) => {
    return {position: (item.globalPrice / max.priceGlobal) * 100 + '%'}
  })*/
  return (
    <>
      <div className="relative ">
        <div className="relative w-full h-2.5 bg-gray-300 rounded overflow-visible">
          <div
            className="w-0 h-full bg-blue-500 rounded transition-width duration-300"
            style={{ width: (currentTix * 100) / max.priceGlobal + '%' }}
          ></div>
          {favItems.map((item) => (
            <div
              className="absolute top-0 flow flow-col -translate-x-1/2 -translate-y-2"
              style={{ left: (item.priceGlobal / max.priceGlobal) * 100 + '%' }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="rounded-full h-8 bg-white ring-2 ring-black aspect-square object-cover "
              />
              <div className="bg-black m-1 rounded-sm flex w-full">
                {item.priceGlobal}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
