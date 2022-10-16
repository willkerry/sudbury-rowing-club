import Image from "next/image";
import localImage from "../../public/assets/error/trouble-at-tmill.jpg";

const ErrorImage = () => (
  <div className="flex justify-center rotate-1">
    <Image
      alt="The time the river ran dry."
      className="rounded-sm"
      height={256}
      src={localImage}
      width={341}
    />
  </div>
);

export default ErrorImage;
