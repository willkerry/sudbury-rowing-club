import { describe, expect, it } from "vitest";
import { toLondonDate, toLondonHour, toLondonHourLabel } from "./london-time";

describe("toLondonDate", () => {
  it("uses the London calendar day, not the UTC one", () => {
    expect(toLondonDate(new Date("2026-08-18T23:30:00Z"))).toBe("2026-08-19");
    expect(toLondonDate(new Date("2026-01-18T23:30:00Z"))).toBe("2026-01-18");
  });
});

describe("toLondonHour", () => {
  it("shifts UTC into British Summer Time", () => {
    expect(toLondonHour(new Date("2026-08-19T06:00:00Z"))).toBe(7);
  });

  it("leaves UTC alone outside British Summer Time", () => {
    expect(toLondonHour(new Date("2026-01-19T06:00:00Z"))).toBe(6);
  });

  it("reads midnight as zero rather than as a padded string", () => {
    expect(toLondonHour(new Date("2026-01-19T00:00:00Z"))).toBe(0);
  });
});

describe("toLondonHourLabel", () => {
  it("pads to two digits so the strip stays aligned", () => {
    expect(toLondonHourLabel(new Date("2026-01-19T06:00:00Z"))).toBe("06");
    expect(toLondonHourLabel(new Date("2026-01-19T18:00:00Z"))).toBe("18");
  });
});
