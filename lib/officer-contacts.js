import md5 from "md5";
import data from "@/data/governance.json";
import groq from "groq";
import { sanityClient } from "@/lib/sanity.server";
import useSWR from "swr";

export function FetchOfficerById(id) {
  const { data, error } = useSWR(
    groq`*[_type == "officers" && !(_id in path("drafts.**")) && vacant == false && email != null && email != "" && _id match '${id}'] | order(order asc){
      email
    }`,
    (query) => sanityClient.fetch(query)
  );
  if (error) return "Error. The API isn’t working.";
  if (!data) return "Error. No data returned.";
  if (data.length > 0) return data[0].email;
  else return "Error. User not found.";
}

const allOfficers = data.officers;
const presentOfficers = allOfficers.filter(
  (officer) => officer.vacant !== true
);
const officersWithRecordedEmails = presentOfficers.filter(
  (officer) => officer.email && officer.email.length > 0
);
const emailRegex = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);
const officersWithValidEmails = officersWithRecordedEmails.filter((officer) =>
  officer.email.match(emailRegex)
);

const masterList = officersWithValidEmails.map((officer, index) => {
  const hashCompose = md5(officer.email + index);
  const hash = hashCompose.toString();
  return {
    name: officer.name,
    role: officer.role,
    email: officer.email,
    hash
  };
});

export const sanitisedAllOfficers = allOfficers.map((officer) => {
  return {
    name: officer.name,
    role: officer.role,
    vacant: officer.vacant
  };
});

export const contactableOfficers = officersWithValidEmails.map(
  (officer, index) => {
    const hashCompose = md5(officer.email + index);
    const hash = hashCompose.toString();
    return {
      name: officer.name,
      role: officer.role,
      hash
    };
  }
);

export function getOfficerByHash(hash) {
  const findOfficer = masterList.find((officer) => officer.hash === hash);

  return findOfficer.email;
}

export function getHashByOfficerMail(officerMail) {
  const findHash = masterList.find((officer) => officer.email === officerMail);
  return findHash.hash;
}
