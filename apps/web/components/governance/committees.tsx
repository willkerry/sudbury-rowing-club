import {
  Description,
  GovGrid,
  SectionTitle,
  SubTitle,
} from "@/components/governance";
import type { Governance } from "@sudburyrc/api";
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
                      "after:block after:font-semibold after:text-gray-400 after:text-xs after:uppercase after:tracking-wider after:content-['Committee_Chair']",
                    "font-medium text-gray-700 text-sm",
                  )}
                >
                  {member.role}
                </div>
                <div className="font-medium text-gray-500 text-xs">
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
