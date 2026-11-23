import clubsData from "@sudburyrc/static/clubs.json";
import { describe, expect, it } from "vitest";
import {
  extendEventName,
  formatClubAndCrewName,
  getBladeUrls,
  getClubsFromCompositeCrewString,
  isCompositeCrew,
  unpickCompositeCrewClubs,
} from "@/app/regatta/records/[event]/utils";
import { createClubLookup } from "@/lib/getClub";

const clubs = createClubLookup(clubsData);
const parse = (clubCode: string) =>
  getClubsFromCompositeCrewString(clubCode, clubs);

describe("formatClubAndCrewName", () => {
  it("should format the club name", () => {
    expect(formatClubAndCrewName(parse("SRC"), true)).toBe(
      "Sudbury Rowing Club",
    );
  });

  it("should verbosely format composite crew names", () => {
    expect(formatClubAndCrewName(parse("SRC/LEA"), true)).toBe(
      "a composite crew from Sudbury Rowing Club and Lea Rowing Club",
    );
  });

  it("should verbosely format names of composite with more than two clubs", () => {
    expect(formatClubAndCrewName(parse("SRC/LEA/NOR"), true)).toBe(
      "a composite crew from Sudbury Rowing Club, Lea Rowing Club and Norwich Rowing Club",
    );
  });

  it("should non-verbosely format composite crew names", () => {
    expect(formatClubAndCrewName(parse("SRC/LEA"), false)).toBe(
      "Sudbury Rowing Club and Lea Rowing Club",
    );
  });

  it("should pass through the code if the club can't be found", () => {
    expect(formatClubAndCrewName(parse("NOT_A_CLUB"), true)).toBe("NOT_A_CLUB");
  });
});

describe("extendEventName", () => {
  it("should extend event name", () => {
    expect(extendEventName("Mx")).toBe("Mixed");
  });
});

describe("isCompositeCrew", () => {
  it("should return true if the club is a composite crew", () => {
    expect(isCompositeCrew("SRC/LEA")).toBe(true);
  });

  it("should return false if the club is not a composite crew", () => {
    expect(isCompositeCrew("SRC")).toBe(false);
  });
});

describe("getClubsFromCompositeCrewString", () => {
  it("should return the clubs from a composite crew string", () => {
    expect(getClubsFromCompositeCrewString("SRC/LEA", clubs)).toEqual([
      {
        bladeUrl:
          "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/117191/465.png",
        href: "https://www.britishrowing.org/rowing-activity-finder/club/?clubid=465",
        id: 465,
        name: "Sudbury Rowing Club",
      },
      {
        bladeUrl:
          "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/116964/537.png",
        href: "https://www.britishrowing.org/rowing-activity-finder/club/?clubid=537",
        id: 537,
        name: "Lea Rowing Club",
      },
    ]);
  });

  it("should return the codes if the club cannot be found", () => {
    expect(
      getClubsFromCompositeCrewString("NOT_A_CLUB/ALSO_NOT_A_CLUB", clubs),
    ).toEqual([{ code: "NOT_A_CLUB" }, { code: "ALSO_NOT_A_CLUB" }]);
  });
});

describe("unpickCompositeCrewClubs", () => {
  it("should return the clubs from a composite crew string", () => {
    expect(unpickCompositeCrewClubs(parse("SRC/LEA"))).toEqual([
      "Sudbury Rowing Club",
      "Lea Rowing Club",
    ]);
  });

  it("should return the codes if the club cannot be found", () => {
    expect(
      unpickCompositeCrewClubs(parse("NOT_A_CLUB/ALSO_NOT_A_CLUB")),
    ).toEqual(["NOT_A_CLUB", "ALSO_NOT_A_CLUB"]);
  });
});

describe("getBladeUrls", () => {
  it("should return the blade urls for a composite crew", () => {
    expect(getBladeUrls(parse("SRC/LEA"))).toEqual([
      "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/117191/465.png",
      "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/116964/537.png",
    ]);
  });

  it("should handle club's with no blade url", () => {
    expect(getBladeUrls(parse("SRC/NOT_A_CLUB"))).toEqual([
      "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/117191/465.png",
    ]);
  });

  it("should return null for missing clubs if nullIfNotFound is true", () => {
    expect(getBladeUrls(parse("SRC/NOT_A_CLUB"), true)).toEqual([
      "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/117191/465.png",
      null,
    ]);
  });
});
