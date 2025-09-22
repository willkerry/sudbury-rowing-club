import Color from "color";
import { Circle } from "lucide-react";
import { tryit } from "radashi";
import { Copy } from "@/components/stour/copy";

const getPrint = (color: string, type: string) => {
  const [_, newColor] = tryit(() => Color(color))();

  if (newColor && type === "rgb") return newColor.rgb().string();
  if (newColor && type === "hsl") return newColor.hsl().round().string();
  return color;
};

export const ColorIndicator = ({
  color = "rgb",
  type,
}: {
  color: string;
  type: string;
}) => {
  const print = getPrint(color, type);

  return (
    <span className="flex flex-row items-center text-xs">
      {print ? (
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
