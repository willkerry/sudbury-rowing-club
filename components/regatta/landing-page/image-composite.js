import cupImage from "../../../public/assets/regatta/landing/cup.png";
import victoriaImage from "../../../public/assets/regatta/landing/victoria.png";
import bladeImage from "../../../public/assets/regatta/landing/blade.png";
import buntingImage from "../../../public/assets/regatta/landing/bunting.png";
import Ticket from "@/components/regatta/landing-page/ticket";
import Image from "next/image";

export function ImageComposite({ ticketItems }) {
  return (
    <div className="relative mx-auto w-80 h-96">
      <div className="absolute top-0 z-10 left-20">
        <Ticket items={ticketItems} />
      </div>
      <div className="absolute bottom-0 z-10 -right-6 rotate-3 drop-shadow-2xl">
        <Image
          src={cupImage}
          placeholder="blur"
          alt=""
          width="150"
          height="167"
        />
      </div>
      <div className="absolute right-0 z-0 -top-2 drop-shadow-xl">
        <Image
          src={buntingImage}
          placeholder="blur"
          alt=""
          width="317"
          height="28"
        />
      </div>
      <div className="absolute bottom-0 z-10 left-6 -rotate-2 drop-shadow-lg">
        <Image
          src={victoriaImage}
          placeholder="blur"
          alt=""
          width="145"
          height="111"
        />
      </div>
      <div className="absolute z-0 rotate-45 -bottom-10 left-36 drop-shadow-lg">
        <Image
          src={bladeImage}
          placeholder="blur"
          alt=""
          width="41"
          height="504"
        />
      </div>
      <div className="absolute z-0 scale-x-[-1] -rotate-45 -bottom-10 right-36 drop-shadow-2xl">
        <Image
          src={bladeImage}
          placeholder="blur"
          alt=""
          width="41"
          height="504"
        />
      </div>
    </div>
  );
}
