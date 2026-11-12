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
    return <div className="leading-snug select-none">{name}</div>;

  return (
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger className="block leading-snug select-none">
          {initialisedName}
        </TooltipTrigger>
        <TooltipContent>{name.replace("+", " ")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
