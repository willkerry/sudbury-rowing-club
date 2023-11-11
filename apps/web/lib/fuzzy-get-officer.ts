import { fetchOfficerNames } from "@sudburyrc/api";
import { diceCoefficient } from "dice-coefficient";
import { keys, memoize, reduce } from "lodash";

type Officer = Awaited<ReturnType<typeof fetchOfficerNames>>[number];

const ALIASES = {
  l2r: ["learntorow", "learn2row", "learntorowcoordinator"],
  web: ["website", "web site", "web", "webmaster"],
  social: ["socialsecretary", "social"],
  socials: ["socialmedia", "socials"],
};

const getAliasesIfKeyIsInAliases = (vague: string) => {
  const vagueIsKeyInAliases = keys(ALIASES).includes(vague);
  return vagueIsKeyInAliases ? ALIASES[vague as keyof typeof ALIASES] : [];
};

const diceCoefficients = (a: string, b: string[]) =>
  b.reduce((max, current) => Math.max(max, diceCoefficient(a, current)), 0);

const removeSpaces = (string: string) => string.replace(/\s/g, "");

const findMostProbableOfficer = (officers: Officer[], vague: string) => {
  const aliases = getAliasesIfKeyIsInAliases(vague);

  return reduce(
    officers,
    (acc, officer) => {
      const name = removeSpaces(officer.name);
      const role = removeSpaces(officer.role);

      const aliasesSimilarity = diceCoefficients(role, aliases);
      const nameSimilarity = diceCoefficient(name, vague);
      const roleSimilarity = diceCoefficient(role, vague);

      const similarity = Math.max(
        aliasesSimilarity,
        nameSimilarity,
        roleSimilarity,
      );

      if (similarity > acc.similarity) return { ...officer, similarity };

      return acc;
    },
    { similarity: 0, name: "", role: "", _id: "" } as Officer & {
      similarity: number;
    },
  );
};

export const fuzzyGetOfficer = async (q: string) => {
  const officers = await memoize(fetchOfficerNames)();

  const officer = officers.find((officer) => officer._id === q);
  if (officer) return officer;

  return findMostProbableOfficer(officers, q);
};
