import type { Governance } from "@sudburyrc/api";
import { cn } from "@/lib/utils";
import { Description } from "./description";
import { GovGrid } from "./gov-grid";
import { SectionTitle } from "./section-title";
import { SubTitle } from "./subtitle";

type Props = {
  committees: Governance["committees"];
};

export const Committees = ({ committees }: Props) => (
  <section>
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
                      "after:caps after:block after:font-semibold after:text-gray-400 after:text-xs after:content-['Committee_Chair']",
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
