import {
  Description,
  GovGrid,
  SectionTitle,
  SubTitle,
} from "@/components/governance";
import type { NonExecutiveOfficer } from "@/types/governance";

type Props = {
  vicePresidents: NonExecutiveOfficer[];
  trustees: NonExecutiveOfficer[];
};

export const NonExec = ({ vicePresidents, trustees }: Props) => (
  <section>
    <SectionTitle>Non-Executive Officers</SectionTitle>
    <GovGrid>
      <div>
        <SubTitle>President</SubTitle>
        <Description>
          By convention, the mayor of Sudbury is invited to be club president.
        </Description>
      </div>
      <div>
        <SubTitle>Vice-Presidents</SubTitle>
        <Description>
          New vice-presidents may be elected each year at the AGM.
        </Description>
        <div className="h-4" />
        <ul className="space-y-1 font-medium text-gray-900 text-sm">
          {vicePresidents?.map(({ _id, firstName, surname }) => (
            <li key={_id}>
              {firstName} {surname}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <SubTitle>Trustees</SubTitle>
        <Description>
          Trustees are responsible for, but not in control of, the club.
        </Description>
        <div className="h-4" />
        <ul className="space-y-1 font-medium text-gray-900 text-sm">
          {trustees?.map(({ _id, firstName, surname }) => (
            <li key={_id}>
              {firstName} {surname}
            </li>
          ))}
        </ul>
      </div>
    </GovGrid>
  </section>
);
