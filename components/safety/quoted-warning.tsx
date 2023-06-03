import { EnvironmentAgency, MetOffice } from "../icons";

export enum WarningSourceEnum {
  metoffice = "metoffice",
  environmentAgency = "environment-agency",
}

type QuotedWarningProps = {
  description: string;
  source?: WarningSourceEnum;
};

let AgencyIcon: React.FC<{ className: string }> = () => null;
let agencyName: string = "";
let agencyColors: string = "";

const QuotedWarning: React.FC<QuotedWarningProps> = ({
  description,
  source,
}) => {
  if (!description) return null;
  if (!source) return null;

  switch (source) {
    case WarningSourceEnum.environmentAgency:
      agencyName = "Environment Agency";
      AgencyIcon = EnvironmentAgency;
      agencyColors = "bg-green-600 text-green-50";
      break;

    case WarningSourceEnum.metoffice:
      agencyName = "Met Office";
      AgencyIcon = MetOffice;
      agencyColors = "bg-gray-700 text-lime-400";
      break;

    default:
      break;
  }

  return (
    <div className="prose prose-p:my-0 prose-blockquote:p-4 prose-blockquote:text-sm">
      {agencyName && <p>The {agencyName} has issued the following warning:</p>}

      <blockquote className="relative overflow-hidden">
        {source && (
          <div
            className={`${agencyColors} absolute right-0 top-0 flex items-center justify-center rounded-bl p-1`}
          >
            <AgencyIcon className="h-4 w-4" />
          </div>
        )}
        <p>{description}</p>
      </blockquote>
    </div>
  );
};

export default QuotedWarning;
