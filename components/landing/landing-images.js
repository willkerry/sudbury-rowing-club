import Image from "next/image";
import tourImage from "../../public/assets/landing/tour.jpg";
import regattaImage from "../../public/assets/landing/regatta.jpg";
import juniorsImage from "../../public/assets/landing/juniors.jpg";

const tour = tourImage;
const regatta = regattaImage;
const juniors = juniorsImage;

const landingImages = [
  {
    src: tour,
    alt: "Sudbury Rowing Club members posing for a photo at an event in Hungary.",
  },
  {
    src: regatta,
    alt: "Sudbury members with their pots at the sunny Sudbury Regatta.",
  },
  {
    src: juniors,
    alt: "Some of Sudbury’s juniors posing with pots at a summer regatta.",
  },
];

function LandingImages() {
  return (
    <div className="my-10 border-t border-b sm:my-16">
      <div className="flex flex-row">
        {landingImages.map(({ src, alt, index }) => (
          <div key={index} className="relative w-1/3 h-24 bg-black sm:h-72">
            <Image src={src} alt={alt} layout="fill" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
export default LandingImages;
