import { EnvironmentAgency, MetOffice } from "../icons";

export enum WarningSourceEnum {
  metoffice = "metoffice",
  environmentAgency = "environment-agency",
}

type QuotedWarningProps = {
  description: string;
  source?: WarningSourceEnum;
};

const QuotedWarning: React.FC<QuotedWarningProps> = ({
  description,
  source,
}) => {
  if (!description) return null;
  if (!source) return null;

  let agencyName: string = "";
  let AgencyIcon: React.FC<{ className: string }> = () => <></>;
  let agencyColors: string = "";

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
  }

  return (
    <div className="prose prose-blockquote:text-sm prose-blockquote:p-4 prose-p:my-0">
      {agencyName && <p>The {agencyName} has issued the following warning:</p>}

      <blockquote className="relative overflow-hidden">
        {source && (
          <div
            className={`${agencyColors} absolute top-0 right-0 flex items-center justify-center p-1 rounded-bl`}
          >
            <AgencyIcon className="w-4 h-4" />
          </div>
        )}
        <p>{description}</p>
      </blockquote>
    </div>
  );
};

export default QuotedWarning;
