import { describe, expect, it } from "vitest";
import { formatAgo, formatWhen } from "./safety-times";

const now = new Date("2026-11-13T21:01:00Z");

describe("formatWhen", () => {
  it("says today for a time earlier on the same London day", () => {
    expect(formatWhen(new Date("2026-11-13T20:30:00Z"), now)).toBe(
      "today at 20:30",
    );
  });

  it("names the day for anything older", () => {
    expect(formatWhen(new Date("2026-11-12T08:05:00Z"), now)).toBe(
      "12 Nov at 08:05",
    );
  });

  it("uses London time in summer", () => {
    expect(
      formatWhen(
        new Date("2026-07-01T07:00:00Z"),
        new Date("2026-07-01T12:00:00Z"),
      ),
    ).toBe("today at 08:00");
  });
});

describe("formatAgo", () => {
  it("says just now inside the first minute", () => {
    expect(formatAgo(new Date("2026-11-13T21:00:30Z"), now)).toBe("just now");
  });

  it("counts minutes, then hours, then days", () => {
    expect(formatAgo(new Date("2026-11-13T20:58:00Z"), now)).toBe("3 min ago");
    expect(formatAgo(new Date("2026-11-13T19:00:00Z"), now)).toBe("2 hr ago");
    expect(formatAgo(new Date("2026-11-10T21:00:00Z"), now)).toBe("3 days ago");
  });
});
