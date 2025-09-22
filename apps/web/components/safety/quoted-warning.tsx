import { smartQuotes } from "@sudburyrc/helpers";
import type { JSX } from "react";
import { EnvironmentAgency, MetOffice } from "@/components/icons";

export const WarningSourceEnum = {
  metoffice: "mo",
  environmentAgency: "ea",
} as const;
export type WarningSourceEnum =
  (typeof WarningSourceEnum)[keyof typeof WarningSourceEnum];

type QuotedWarningProps = {
  description: string;
  source?: WarningSourceEnum;
};

const getAgency = (
  source?: WarningSourceEnum,
): {
  agencyName: string;
  agencyColors: string;
  AgencyIcon: (
    props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
  ) => React.ReactNode;
  notFound: boolean;
} => {
  switch (source) {
    case WarningSourceEnum.environmentAgency:
      return {
        agencyName: "Environment Agency",
        agencyColors: "bg-green-600 text-green-50",
        AgencyIcon: EnvironmentAgency,
        notFound: false,
      };
    case WarningSourceEnum.metoffice:
      return {
        agencyName: "Met Office",
        agencyColors: "bg-gray-700 text-lime-400",
        AgencyIcon: MetOffice,
        notFound: false,
      };
    default:
      return {
        agencyName: "",
        agencyColors: "",
        AgencyIcon: () => null,
        notFound: true,
      };
  }
};

export const QuotedWarning = ({ description, source }: QuotedWarningProps) => {
  if (!description) return null;

  const { agencyName, agencyColors, AgencyIcon, notFound } = getAgency(source);

  if (notFound) return null;

  return (
    <div className="text-gray-900">
      {agencyName && <p>The {agencyName} has issued the following warning:</p>}

      <blockquote className="relative mt-3 overflow-hidden rounded-sm border p-3 text-gray-700">
        {source && (
          <div
            className={`${agencyColors} absolute top-0 right-0 flex items-center justify-center rounded-bl p-1`}
          >
            <AgencyIcon aria-hidden className="h-4 w-4" />
          </div>
        )}
        <p className="text-sm">{smartQuotes(description)}</p>
      </blockquote>
    </div>
  );
};
