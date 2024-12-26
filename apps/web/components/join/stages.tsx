import Label from "@/components/stour/label";
import { cn } from "@/lib/utils";
import styles from "./stages.module.css";

type Stage = { name: string; content: string };
type Props = {
  stages: Stage[];
};

const L2RStages = ({ stages }: Props) => (
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
          key={stage.name}
          className={cn(
            "relative ml-8 before:absolute lg:ml-0",
            "before:disambiguate before:font-bold before:text-sm before:content-[counter(a)]",
            "before:rounded-full before:border-2 before:border-current before:text-center",
            "before:-left-7 before:top-px before:h-5 before:w-5 before:leading-4",
            styles.incrementStageCounter,
          )}
        >
          <div className="font-semibold text-gray-700 text-lg leading-tight">
            {stage.name}
          </div>
          <p className="!text-gray-500">{stage.content}</p>
        </li>
      ))}
    </ol>
  </div>
);

export default L2RStages;
