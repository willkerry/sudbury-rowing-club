import { NonExecutiveOfficer } from "@/types/governance";
import {
  Description,
  GovGrid,
  SectionTitle,
  SubTitle,
} from "@/components/governance";

type Props = {
  vicePresidents: NonExecutiveOfficer[];
  trustees: NonExecutiveOfficer[];
};

const NonExec = ({ vicePresidents, trustees }: Props) => (
  <section id="nonexec">
    <SectionTitle>Non-Executive Officers</SectionTitle>
    <GovGrid>
      <div>
        <SubTitle>President</SubTitle>
        <Description>
          By convention, the mayor of Sudbury is invited to be club president.
        </Description>
      </div>
      <div className="">
        <SubTitle>Vice-Presidents</SubTitle>
        <Description>
          New vice-presidents may be elected each year at the AGM.
        </Description>
        <div className="h-4" />
        <ul className="space-y-1 text-sm font-medium text-gray-900 ">
          {vicePresidents !== null &&
            vicePresidents.map((vicePresident) => (
              <li key={vicePresident._id}>
                {vicePresident.firstName} {vicePresident.surname}
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
        <ul className="space-y-1 text-sm font-medium text-gray-900 ">
          {trustees !== null &&
            trustees.map((trustee) => (
              <li key={trustee._id}>
                {trustee.firstName} {trustee.surname}
              </li>
            ))}
        </ul>
      </div>
    </GovGrid>
  </section>
);

export default NonExec;
