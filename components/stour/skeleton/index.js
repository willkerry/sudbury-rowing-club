import Cleavers from "@/components/icons/cleavers";
import { Circle } from "react-feather";

export function Skeleton() {
  return (
    <div className="relative w-12 h-12 mx-auto">
      <Cleavers className="absolute m-2 text-gray-500 animate-pulse " />
      <Circle
        className="absolute w-10 h-10 text-gray-500 animate-ping"
        strokeWidth={1}
      />
    </div>
  );
}

export default Skeleton;
