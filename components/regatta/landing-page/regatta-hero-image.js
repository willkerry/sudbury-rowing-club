import Image from "next/image";
import React from "react";
import droneImage from "../../../public/assets/regatta/landing/drone.jpg";
import { ArrowUpIcon } from "@heroicons/react/solid";

export default function RegattaHeroImage({ title, subtitle }) {
  return (
    <div className="relative flex overflow-hidden shadow-lg rounded-xl">
      <Image
        src={droneImage}
        placeholder="blur"
        alt=""
        width="984"
        height="492"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black via-transparent to-transparent" />
      <div className="absolute top-0 left-0 flex items-end w-full h-full p-6 md:p-12">
        <div className="hidden w-2/3 sm:block">
          <div className="text-4xl font-bold tracking-tighter text-white md:text-6xl leading-tighter drop-shadow">
            {title}
          </div>
          <div className="font-medium text-white opacity-75">
            <ArrowUpIcon className="inline-flex w-4 h-4 mb-px" size="1em" /> {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}
