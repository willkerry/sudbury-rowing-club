import { cn } from "@/lib/utils";
import Crest from "../logo/crest";
import { Numeral } from "./150-numeral";

export const HundredAndFiftyLogo = ({ block = true }) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-4",
      block ? "my-8" : "w-min",
    )}
  >
    <Crest className="z-10 w-20" />
    <Numeral className="z-10" />
  </div>
);
