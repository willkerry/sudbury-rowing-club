import type { Governance } from "@sudburyrc/api";
import {
  Description,
  GovGrid,
  SectionTitle,
  SubTitle,
} from "@/components/governance";
import cn from "clsx";

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
            {committee.members?.map((member, i) => (
              <li className="relative mb-3 text-gray-800" key={member._id}>
                <div
                  className={cn(
                    !i &&
                      "after:block after:text-xs after:font-semibold after:uppercase after:tracking-wider after:text-gray-400 after:content-['Committee_Chair']",
                    "text-sm font-medium text-gray-700"
                  )}
                >
                  {member.role}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  {member.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </GovGrid>
  </section>
);

export default Committees;
