import { describe, expect, it } from "vitest";
import { parseBoat } from "./parse-boat";

describe("parseBoat", () => {
  it("parses a standard crew entry", () => {
    expect(parseBoat({ text: " 29, HUN-MANCHETT" })).toEqual({
      aliasedClubs: undefined,
      category: null,
      club: "HUN",
      clubHref: null,
      crewName: "MANCHETT",
      num: 29,
      scratched: false,
      winner: false,
    });
  });

  it("extracts a trailing category suffix", () => {
    expect(parseBoat({ text: " 40, DEB-STREAT-2 (F)" })).toEqual({
      aliasedClubs: undefined,
      category: "F",
      club: "DEB",
      clubHref: null,
      crewName: "STREAT-2",
      num: 40,
      scratched: false,
      winner: false,
    });
  });

  it("handles two-way composite crews", () => {
    const boat = parseBoat({ text: "152, SRC/KRC-MOULE" });
    expect(boat?.club).toBe("SRC");
    expect(boat?.aliasedClubs).toEqual(["KRC"]);
    expect(boat?.crewName).toBe("MOULE");
  });

  it("handles three-way composite crews", () => {
    const boat = parseBoat({ text: "151, SRC/LMH/KRC-BULLEN" });
    expect(boat?.club).toBe("SRC");
    expect(boat?.aliasedClubs).toEqual(["LMH", "KRC"]);
    expect(boat?.crewName).toBe("BULLEN");
  });

  it("preserves winner and scratched flags", () => {
    const boat = parseBoat({
      clubHref: "/live/club_HUN.html",
      scratched: true,
      text: " 29, HUN-MANCHETT",
      winner: true,
    });
    expect(boat?.winner).toBe(true);
    expect(boat?.scratched).toBe(true);
    expect(boat?.clubHref).toBe("/live/club_HUN.html");
  });

  it("returns null for empty or whitespace input", () => {
    expect(parseBoat({ text: "" })).toBeNull();
    expect(parseBoat({ text: "   " })).toBeNull();
    expect(parseBoat({ text: "\u00a0\u00a0" })).toBeNull();
  });

  it("falls back gracefully for non-standard text", () => {
    const boat = parseBoat({ text: "bye" });
    expect(boat).not.toBeNull();
    expect(boat?.num).toBeNull();
    expect(boat?.club).toBe("");
    expect(boat?.crewName).toBe("bye");
  });
});
