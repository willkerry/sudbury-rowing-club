import Image from "next/image";

const ErrorImage = () => (
  <div className="flex rotate-1 justify-center">
    <Image
      alt="The time the river ran dry."
      className="rounded-xs"
      height={256}
      src="../../public/assets/error/trouble-at-tmill.jpg"
      width={341}
    />
  </div>
);

export default ErrorImage;
