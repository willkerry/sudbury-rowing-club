import Label from "@/components/stour/label";
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
      className={`grid gap-16 text-green-500 sm:grid-cols-2 md:grid-cols-3 ${styles.stages}`}
    >
      {stages.map((stage) => (
        <li key={stage.name} className="ml-8 lg:ml-0">
          <div className="text-lg font-semibold leading-tight text-gray-700">
            {stage.name}
          </div>
          <p className="!text-gray-500">{stage.content}</p>
        </li>
      ))}
    </ol>
  </div>
);

export default L2RStages;
