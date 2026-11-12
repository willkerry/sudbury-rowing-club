import { Label } from "@/components/stour/label";
import { cn } from "@/lib/utils";
import styles from "./stages.module.css";

type Stage = { name: string; content: string };
type Props = {
  stages: Stage[];
};

export const L2RStages = ({ stages }: Props) => (
  <div className="mt-24">
    <Label as="h3" className="mb-6 ml-8 text-green-600 md:ml-0">
      How it works
    </Label>
    <ol
      className={cn(
        "grid gap-16 text-green-500 sm:grid-cols-2 md:grid-cols-3",
        "list-none",
      )}
    >
      {stages.map((stage) => (
        <li
          className={cn(
            "relative ml-8 before:absolute xl:ml-0",
            "before:disambiguate before:text-sm before:font-bold before:content-[counter(a)]",
            "before:rounded-full before:border-2 before:border-current before:text-center",
            "before:top-px before:-left-7 before:h-5 before:w-5 before:leading-4",
            styles.incrementStageCounter,
          )}
          key={stage.name}
        >
          <div className="text-lg leading-tight font-semibold text-gray-700">
            {stage.name}
          </div>
          <p className="text-gray-500!">{stage.content}</p>
        </li>
      ))}
    </ol>
  </div>
);
