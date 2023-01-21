import type { Governance } from "@/lib/queries/fetch-governance";
import {
  Description,
  GovGrid,
  SectionTitle,
  SubTitle,
} from "@/components/governance";

type Props = {
  committees: Governance["committees"];
};

const Committees = ({ committees }: Props) => (
  <section id="committees">
    <SectionTitle>Committees</SectionTitle>
    <GovGrid>
      {committees.map((committee) => (
        <div key={committee._id}>
          <SubTitle>{committee.title}</SubTitle>
          <Description>{committee.description}</Description>
          <div className="h-4" />
          <ul>
            {committee.members !== null &&
              committee.members.map((member) => (
                <li
                  className="relative mb-3 ml-4 text-gray-800 first:before:text-gray-400 committee-member"
                  key={member._id}
                >
                  <div className="text-sm font-medium text-gray-700">
                    {member.role}
                  </div>
                  <div className="text-xs text-gray-500">{member.name}</div>
                  <style jsx>{`
                    .committee-member:first-child::before {
                      writing-mode: vertical-rl;
                      font-weight: 600;
                      content: "Chair";
                      letter-spacing: 0.1em;
                      text-transform: uppercase;
                      font-size: 0.5rem;
                      line-height: 1;
                      position: absolute;
                      left: -1rem;
                      top: 0.3rem;
                    }
                  `}</style>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </GovGrid>
  </section>
);

export default Committees;
