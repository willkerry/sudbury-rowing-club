import Label from "@/components/stour/label";

type Stage = { name: string; content: string };
type Props = {
  stages: Stage[];
};

const L2RStages = ({ stages }: Props) => (
  <div className="mt-24">
    <Label as="h3" className="mb-6 ml-8 text-green-600 md:ml-0">
      How it works
    </Label>
    <ol className="grid gap-16 text-green-500 sm:grid-cols-2 md:grid-cols-3">
      <style jsx>{`
        ol {
          list-style: none;
          counter-reset: a;
        }
        ol li {
          counter-increment: a;
          position: relative;
        }
        ol li::before {
          content: counter(a);
          font-weight: 500;
          font-size: 0.875rem;
          text-align: center;
          position: absolute;
          border-radius: 100%;
          border-width: 1px;
          border-color: currentColor;
          width: 1.25rem;
          height: 1.25rem;
          top: 1px;
          left: -2rem;
          line-height: 1.3;
        }
        ol li p {
          color: inherit;
        }
      `}</style>
      {stages.map((stage, i) => (
        <li key={i} className="ml-8 lg:ml-0">
          <div className="text-lg font-semibold leading-tight tracking-tight text-gray-700">
            {stage.name}
          </div>
          <p className="!text-gray-500">{stage.content}</p>
        </li>
      ))}
    </ol>
  </div>
);

export default L2RStages;
