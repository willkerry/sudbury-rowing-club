import md5 from "md5";
import data from "@/data/governance.json";

const allOfficers = data.officers;
const presentOfficers = allOfficers.filter(
  (officer) => officer.vacant !== true
);
const officersWithRecordedEmails = presentOfficers.filter(
  (officer) => officer.email && officer.email.length > 0
);
const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
const officersWithValidEmails = officersWithRecordedEmails.filter((officer) =>
  officer.email.match(emailRegex)
);

export const contactableOfficers = officersWithValidEmails.map(
  (officer, index) => {
    const hashCompose =  md5(officer.email + index);
    const hash = hashCompose.toString();
    return {
      ...officer,
      hash,
    };
  }
);

console.log(contactableOfficers);

export function getOfficerByHash(hash) {
  const findOfficer = contactableOfficers.find(
    (officer) => officer.hash === hash
  );
  return findOfficer.email;
}

export function getHashByOfficerMail(officerMail) {
  const findHash = contactableOfficers.find(
    (officer) => officer.email === officerMail
  );
  return findHash.hash;
}
