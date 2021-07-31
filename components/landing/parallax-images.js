import Image from "next/image";
import cn from "classnames";
import TourImage from "../../public/assets/landing/tour.jpg";
import RegattaImage from "../../public/assets/landing/regatta.jpg";
import JuniorsImage from "../../public/assets/landing/juniors.jpg";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";

const parallaxImageClasses = "rounded-lg";

function ImageWrapper(props) {
  return (
    <div className={cn("rounded-lg max-w-max shadow flex", props.className)}>
      {props.children}
    </div>
  );
}

function ParallaxImage(props) {
  return (
    <ParallaxProvider>
      <div className="grid pt-16 md:">
        <Parallax y={[-10, 20]} tagOuter="figure">
          <ImageWrapper>
            <Image
              src={TourImage}
              width="307"
              height="230"
              layout="fixed"
              alt="Tour"
              className={cn("z-0", parallaxImageClasses)}
            />
          </ImageWrapper>
        </Parallax>
        <Parallax y={[-70, -40]} tagOuter="figure">
          <ImageWrapper className="ml-5">
            <Image
              src={JuniorsImage}
              width="200"
              height="117"
              layout="fixed"
              alt="Juniors"
              className={cn("", parallaxImageClasses)}
            />
          </ImageWrapper>
        </Parallax>
        <Parallax y={[-140, -90]} tagOuter="figure">
          <ImageWrapper className="ml-20">
            <Image
              src={RegattaImage}
              width="200"
              height="109"
              layout="fixed"
              alt="Regatta"
              className={cn("flex justify-end", parallaxImageClasses)}
            />
          </ImageWrapper>
        </Parallax>
      </div>
    </ParallaxProvider>
  );
}
export default ParallaxImage;
