import type { DetailedHTMLProps, InsHTMLAttributes } from "react";
import { ServerOrClientDateFormatter } from "@/components/utils/server-or-client-date-formatter";

const COLORS = {
  1: "bg-green-50 border-green-300",
  2: "bg-amber-50 border-amber-300",
} as const;

const FOREGROUND_COLORS = {
  1: "text-green-700",
  2: "text-amber-700",
} as const;

const AMENDEMENTS = {
  1: new Date("2019-02-25"),
  2: new Date("2023-10-24"),
} as const;

const AmendmentDate = ({ set }: { set: keyof typeof COLORS }) => (
  <>
    <span className="sr-only"> Amendment ratified in </span>
    <ServerOrClientDateFormatter
      className="disambiguate font-semibold text-xs"
      format="year"
      dateString={AMENDEMENTS[set]}
    />
  </>
);

type InsProps = {
  set?: keyof typeof COLORS;
} & DetailedHTMLProps<InsHTMLAttributes<HTMLModElement>, HTMLModElement>;

export const Ins = ({ set = 1, children, ...props }: InsProps) => (
  <ins
    className={`-my-0.5 mx-0.5 rounded-sm border px-0.5 py-0.5 not-italic no-underline ${COLORS[set]}`}
    dateTime={AMENDEMENTS[set].toISOString()}
    {...props}
  >
    {children}
    <span className={`px-1 ${FOREGROUND_COLORS[set]}`}>
      <AmendmentDate set={set} />
    </span>
  </ins>
);

export const InsBlock = ({ set = 1, children, ...props }: InsProps) => (
  <ins
    className={`block rounded-sm border pr-2 pl-2 no-underline ${COLORS[set]}`}
    dateTime={AMENDEMENTS[set].toISOString()}
    {...props}
  >
    {children}

    <div className={`-mt-7 pb-1 text-right ${FOREGROUND_COLORS[set]}`}>
      <AmendmentDate set={set} />
    </div>
  </ins>
);
