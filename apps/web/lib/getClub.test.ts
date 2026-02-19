import { describe, expect, it } from "vitest";
import { getClub, getClubByCode } from "@/lib/getClub";

const club = {
  bladeUrl:
    "https://britishrowing.justgo.com/store/downloadpublic?t=custom&f=media/images/BladeDesign/117191/465.png",
  href: "https://www.britishrowing.org/rowing-activity-finder/club/?clubid=465",
  id: 465,
  name: "Sudbury Rowing Club",
};

describe("getClub", () => {
  it("should return the correct club", () => {
    expect(getClub("Sudbury Rowing Club")).toEqual(club);
  });

  it("should return the correct club with a suffix", () => {
    expect(getClub("Sudbury RC")).toEqual(club);
  });

  it("should return undefined if no argument is provided", () => {
    expect(getClub("")).toBeUndefined();
  });

  it("should return undefined if no club is found", () => {
    expect(getClub("DUMMY")).toBeUndefined();
  });
});

describe("getClubByCode", () => {
  it("should return the correct club", () => {
    expect(getClubByCode("SRC")).toEqual(club);
  });

  it("should return undefined if no club is found", () => {
    expect(getClubByCode("DUMMY")).toBeUndefined();
  });

  it("should return undefined if no argument is provided", () => {
    expect(getClubByCode("")).toBeUndefined();
  });
});
