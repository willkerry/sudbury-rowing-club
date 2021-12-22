import Image from "next/image";
import PropTypes from "prop-types";
import cupImage from "../../../public/assets/regatta/landing/cup.png";
import victoriaImage from "../../../public/assets/regatta/landing/victoria.png";
import bladeImage from "../../../public/assets/regatta/landing/blade.png";
import buntingImage from "../../../public/assets/regatta/landing/bunting.png";
import Ticket from "@/components/regatta/landing-page/ticket";

export default function ImageComposite({ ticketItems }) {
  return (
    <div className="relative w-64 mx-auto h-96">
      <div className="absolute z-10 bottom-12 left-10">
        <Ticket items={ticketItems} />
      </div>
      <div className="absolute right-0 z-10 bottom-8 rotate-3 drop-shadow-lg">
        <Image
          src={cupImage}
          placeholder="blur"
          alt=""
          width="90"
          height="100"
        />
      </div>
      <div className="absolute left-0 right-0 z-0 top-6 drop-shadow-lg">
        <Image
          src={buntingImage}
          placeholder="blur"
          alt=""
          width="317"
          height="28"
        />
      </div>
      <div className="absolute left-0 z-10 bottom-3 -rotate-2 drop-shadow-lg">
        <Image
          src={victoriaImage}
          placeholder="blur"
          alt=""
          width="145"
          height="111"
        />
      </div>
      <div className="absolute bottom-0 z-0 rotate-45 left-28 drop-shadow-lg">
        <Image
          src={bladeImage}
          placeholder="blur"
          alt=""
          width="34"
          height="425"
        />
      </div>
      <div className="absolute z-0 scale-x-[-1] -rotate-45 bottom-0 right-28 drop-shadow-2xl">
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
}

ImageComposite.propTypes = {
  ticketItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ).isRequired,
};
