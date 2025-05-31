import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { initialiseName } from "@/lib/helpers/initialiseName";

export const InitialisedName = ({ name }: { name: string }) => {
  const initialisedName = initialiseName(name);

  if (initialisedName === name)
    return <div className="select-none leading-snug">{name}</div>;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="block select-none leading-snug">
          {initialisedName}
        </TooltipTrigger>
        <TooltipContent>{name.replace("+", " ")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
