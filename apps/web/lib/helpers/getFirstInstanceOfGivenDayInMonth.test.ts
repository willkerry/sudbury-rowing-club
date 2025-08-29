import { describe, expect, it } from "vitest";
import { getFirstInstanceOfGivenDayInMonth } from "./getFirstInstanceOfGivenDayInMonth";

describe("getFirstInstanceOfGivenDayInMonth", () => {
  describe("May 1960", () => {
    it("should return the first Monday in May 1960", () => {
      const result = getFirstInstanceOfGivenDayInMonth(1960, 0, 4);
      expect(result.getFullYear()).toBe(1960);
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(2);
      expect(result.getDay()).toBe(1);
    });

    it("should return the first Tuesday in May 1960", () => {
      const result = getFirstInstanceOfGivenDayInMonth(1960, 1, 4);
      expect(result.getFullYear()).toBe(1960);
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(3);
      expect(result.getDay()).toBe(2);
    });

    it("should return the first Wednesday in May 1960", () => {
      const result = getFirstInstanceOfGivenDayInMonth(1960, 2, 4);
      expect(result.getFullYear()).toBe(1960);
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(4);
      expect(result.getDay()).toBe(3);
    });

    it("should return the first Thursday in May 1960", () => {
      const result = getFirstInstanceOfGivenDayInMonth(1960, 3, 4);
      expect(result.getFullYear()).toBe(1960);
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(5);
      expect(result.getDay()).toBe(4);
    });

    it("should return the first Friday in May 1960", () => {
      const result = getFirstInstanceOfGivenDayInMonth(1960, 4, 4);
      expect(result.getFullYear()).toBe(1960);
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(6);
      expect(result.getDay()).toBe(5);
    });

    it("should return the first Saturday in May 1960", () => {
      const result = getFirstInstanceOfGivenDayInMonth(1960, 5, 4);
      expect(result.getFullYear()).toBe(1960);
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(7);
      expect(result.getDay()).toBe(6);
    });

    it("should return the first Sunday in May 1960", () => {
      const result = getFirstInstanceOfGivenDayInMonth(1960, 6, 4);
      expect(result.getFullYear()).toBe(1960);
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(1);
      expect(result.getDay()).toBe(0);
    });
  });

  describe("edge cases", () => {
    it("should handle December correctly", () => {
      const result = getFirstInstanceOfGivenDayInMonth(1960, 6, 11);
      expect(result.getFullYear()).toBe(1960);
      expect(result.getMonth()).toBe(11);
      expect(result.getDate()).toBe(4);
    });

    it("should handle leap year February", () => {
      const result = getFirstInstanceOfGivenDayInMonth(1960, 1, 1);
      expect(result.getFullYear()).toBe(1960);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(2);
    });
  });

  describe("function behavior", () => {
    it("should return a Date object", () => {
      const result = getFirstInstanceOfGivenDayInMonth(1960, 0, 4);
      expect(result).toBeInstanceOf(Date);
    });

    it("should not modify the input parameters", () => {
      const year = 1960;
      const weekDay = 0;
      const month = 4;

      getFirstInstanceOfGivenDayInMonth(year, weekDay, month);

      expect(year).toBe(1960);
      expect(weekDay).toBe(0);
      expect(month).toBe(4);
    });
  });
});
