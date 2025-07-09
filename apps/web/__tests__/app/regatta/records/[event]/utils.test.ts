import { describe, expect, it } from "vitest";
import {
  extendEventName,
  formatClubAndCrewName,
  getBladeUrls,
  getClubsFromCompositeCrewString,
  isCompositeCrew,
  unpickCompositeCrewClubs,
} from "@/app/regatta/records/[event]/utils";

describe("formatClubAndCrewName", () => {
  it("should format the club name", () => {
    expect(formatClubAndCrewName("SRC", true)).toBe("Sudbury Rowing Club");
  });

  it("should verbosely format composite crew names", () => {
    expect(formatClubAndCrewName("SRC/LEA", true)).toBe(
      "a composite crew from Sudbury Rowing Club and Lea Rowing Club",
    );
  });

  it("should verbosely format names of composite with more than two clubs", () => {
    expect(formatClubAndCrewName("SRC/LEA/NOR", true)).toBe(
      "a composite crew from Sudbury Rowing Club, Lea Rowing Club and Norwich Rowing Club",
    );
  });

  it("should non-verbosely format composite crew names", () => {
    expect(formatClubAndCrewName("SRC/LEA", false)).toBe(
      "Sudbury Rowing Club and Lea Rowing Club",
    );
  });

  it("should pass through the code if the club can't be found", () => {
    expect(formatClubAndCrewName("NOT_A_CLUB", true)).toBe("NOT_A_CLUB");
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
    expect(getClubsFromCompositeCrewString("SRC/LEA")).toEqual([
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
      getClubsFromCompositeCrewString("NOT_A_CLUB/ALSO_NOT_A_CLUB"),
    ).toEqual([{ code: "NOT_A_CLUB" }, { code: "ALSO_NOT_A_CLUB" }]);
  });
});

describe("unpickCompositeCrewClubs", () => {
  it("should return the clubs from a composite crew string", () => {
    expect(unpickCompositeCrewClubs("SRC/LEA")).toEqual([
      "Sudbury Rowing Club",
      "Lea Rowing Club",
    ]);
  });

  it("should return the codes if the club cannot be found", () => {
    expect(unpickCompositeCrewClubs("NOT_A_CLUB/ALSO_NOT_A_CLUB")).toEqual([
      "NOT_A_CLUB",
      "ALSO_NOT_A_CLUB",
    ]);
  });
});

describe("getBladeUrls", () => {
  it("should return the blade urls for a composite crew", () => {
    expect(getBladeUrls("SRC/LEA")).toEqual([
      "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/117191/465.png",
      "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/116964/537.png",
    ]);
  });

  it("should handle club's with no blade url", () => {
    expect(getBladeUrls("SRC/NOT_A_CLUB")).toEqual([
      "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/117191/465.png",
    ]);
  });
});
