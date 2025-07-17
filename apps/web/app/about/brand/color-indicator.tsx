import Color from "color";
import { Circle } from "lucide-react";
import { tryit } from "radash";
import { Copy } from "@/components/stour/copy";

export const ColorIndicator = ({
  color = "rgb",
  type,
}: {
  color: string;
  type: string;
}) => {
  const [_, newColor] = tryit(() => Color(color))();

  let print = color;
  if (newColor && type === "rgb") print = newColor.rgb().string();
  if (newColor && type === "hsl") print = newColor.hsl().round().string();
  return (
    <span className="flex flex-row items-center text-xs">
      {newColor ? (
        <>
          <Circle className="h-4 text-gray-200" fill={color} />
          <Copy value={print.toUpperCase()} />
        </>
      ) : (
        color
      )}
    </span>
  );
};
