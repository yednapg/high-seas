"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";

import Photo1 from "../marquee/1.jpeg";
import Photo2 from "../marquee/2.png";
import Photo3 from "../marquee/3.jpeg";
import Photo4 from "../marquee/4.jpeg";
import Photo5 from "../marquee/5.jpeg";

export default function ScrollShop() {
  return (
    <Marquee autoFill pauseOnHover speed="75">
      <div style={{ width: "200px", margin: "0 10px" }}>
        <Image
          src={Photo1}
          alt="Photo 1"
          layout="responsive"
          width={200}
          height={200}
          objectFit="cover"
        />
      </div>
      <div style={{ width: "200px", margin: "0 10px" }}>
        <Image
          src={Photo2}
          alt="Photo 2"
          layout="responsive"
          width={200}
          height={200}
          objectFit="cover"
        />
      </div>
      <div style={{ width: "200px", margin: "0 10px" }}>
        <Image
          src={Photo3}
          alt="Photo 3"
          layout="responsive"
          width={200}
          height={200}
          objectFit="cover"
        />
      </div>
      <div style={{ width: "200px", margin: "0 10px" }}>
        <Image
          src={Photo4}
          alt="Photo 4"
          layout="responsive"
          width={200}
          height={200}
          objectFit="cover"
        />
      </div>
      <div style={{ width: "200px", margin: "0 10px" }}>
        <Image
          src={Photo5}
          alt="Photo 5"
          layout="responsive"
          width={200}
          height={200}
          objectFit="cover"
        />
      </div>
    </Marquee>
  );
}
