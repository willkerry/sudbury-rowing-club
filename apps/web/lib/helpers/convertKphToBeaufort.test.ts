import { describe, expect, it } from "vitest";
import { convertKphToBeaufort } from "@/lib/helpers/convertKphToBeaufort";

describe("convertKphToBeaufort", () => {
  it("should convert a kph to a beaufort", () => {
    expect(convertKphToBeaufort(0)).toBe(0);
    expect(convertKphToBeaufort(0.5)).toBe(0);
    expect(convertKphToBeaufort(1)).toBe(1);
    expect(convertKphToBeaufort(5)).toBe(1);
    expect(convertKphToBeaufort(6)).toBe(2);
    expect(convertKphToBeaufort(12)).toBe(3);
    expect(convertKphToBeaufort(19)).toBe(3);
    expect(convertKphToBeaufort(20)).toBe(4);
    expect(convertKphToBeaufort(28)).toBe(4);
    expect(convertKphToBeaufort(29)).toBe(5);
    expect(convertKphToBeaufort(38)).toBe(5);
    expect(convertKphToBeaufort(39)).toBe(6);
    expect(convertKphToBeaufort(49)).toBe(6);
    expect(convertKphToBeaufort(50)).toBe(7);
    expect(convertKphToBeaufort(61)).toBe(7);
    expect(convertKphToBeaufort(62)).toBe(8);
    expect(convertKphToBeaufort(74)).toBe(8);
    expect(convertKphToBeaufort(75)).toBe(9);
    expect(convertKphToBeaufort(88)).toBe(9);
    expect(convertKphToBeaufort(89)).toBe(10);
    expect(convertKphToBeaufort(102)).toBe(10);
    expect(convertKphToBeaufort(103)).toBe(11);
    expect(convertKphToBeaufort(117)).toBe(11);
    expect(convertKphToBeaufort(118)).toBe(12);
    expect(convertKphToBeaufort(Number.MAX_SAFE_INTEGER)).toBe(12);
    expect(convertKphToBeaufort(Number.MAX_VALUE)).toBe(12);
    expect(convertKphToBeaufort(Number.POSITIVE_INFINITY)).toBe(12);

    expect(() => convertKphToBeaufort(-1)).toThrow();
    expect(() => convertKphToBeaufort(Number.NaN)).toThrow();
  });
});
