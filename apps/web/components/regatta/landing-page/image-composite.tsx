import Image from "next/image";
import type { JSX } from "react";
import { Ticket } from "@/components/regatta/landing-page/ticket";
import bladeImage from "../../../public/assets/regatta/landing/blade.png";
import buntingImage from "../../../public/assets/regatta/landing/bunting.png";
import cupImage from "../../../public/assets/regatta/landing/cup.png";
import victoriaImage from "../../../public/assets/regatta/landing/victoria.png";

export const ImageComposite = ({
  ticketItems,
}: {
  ticketItems: [string, string | JSX.Element][];
}) => (
  <div className="relative mx-auto h-96 w-64">
    <div className="absolute bottom-12 left-10 z-10">
      <Ticket items={ticketItems} />
    </div>
    <div className="absolute right-0 bottom-8 z-10 rotate-3 drop-shadow-lg">
      <Image src={cupImage} placeholder="blur" alt="" width="90" height="100" />
    </div>
    <div className="absolute top-6 right-0 left-0 z-0 drop-shadow-lg">
      <Image
        src={buntingImage}
        placeholder="blur"
        alt=""
        width="317"
        height="28"
      />
    </div>
    <div className="-rotate-2 absolute bottom-3 left-0 z-10 drop-shadow-lg">
      <Image
        src={victoriaImage}
        placeholder="blur"
        alt=""
        width="145"
        height="111"
      />
    </div>
    <div className="absolute bottom-0 left-28 z-0 rotate-45 drop-shadow-lg">
      <Image
        src={bladeImage}
        placeholder="blur"
        alt=""
        width="34"
        height="425"
      />
    </div>
    <div className="-rotate-45 absolute right-28 bottom-0 z-0 scale-x-[-1] drop-shadow-2xl">
      <Image
        src={bladeImage}
        placeholder="blur"
        alt=""
        width="34"
        height="425"
      />
    </div>
  </div>
);
