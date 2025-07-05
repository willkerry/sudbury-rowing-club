import { describe, it, expect, beforeEach, vi } from "vitest";
import { scrollToSelector } from "@/lib/scrollToSelector";

describe("scrollToSelector", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it("should return early if element is not found", () => {
    // Mock querySelector to return null
    const mockQuerySelector = vi.fn().mockReturnValue(null);
    Object.defineProperty(window, "document", {
      value: { querySelector: mockQuerySelector },
      writable: true,
    });

    scrollToSelector("#nonexistent");

    expect(mockQuerySelector).toHaveBeenCalledWith("#nonexistent");
  });

  it("should call scrollIntoView on parent element when element is found", () => {
    const mockScrollIntoView = vi.fn();
    const mockParentElement = {
      scrollIntoView: mockScrollIntoView,
    };
    const mockElement = {
      parentElement: mockParentElement,
    };

    const mockQuerySelector = vi.fn().mockReturnValue(mockElement);
    Object.defineProperty(window, "document", {
      value: { querySelector: mockQuerySelector },
      writable: true,
    });

    scrollToSelector("#test-element");

    expect(mockQuerySelector).toHaveBeenCalledWith("#test-element");
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("should not crash if element has no parent", () => {
    const mockElement = {
      parentElement: null,
    };

    const mockQuerySelector = vi.fn().mockReturnValue(mockElement);
    Object.defineProperty(window, "document", {
      value: { querySelector: mockQuerySelector },
      writable: true,
    });

    expect(() => {
      scrollToSelector("#test-element");
    }).not.toThrow();
  });

  it("should call focus on element if it has focus method", () => {
    const mockFocus = vi.fn();
    const mockScrollIntoView = vi.fn();
    const mockParentElement = {
      scrollIntoView: mockScrollIntoView,
    };
    const mockElement = {
      parentElement: mockParentElement,
      focus: mockFocus,
    };

    const mockQuerySelector = vi.fn().mockReturnValue(mockElement);
    Object.defineProperty(window, "document", {
      value: { querySelector: mockQuerySelector },
      writable: true,
    });

    scrollToSelector("#input-element");

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    expect(mockFocus).toHaveBeenCalled();
  });

  it("should not call focus if element does not have focus property", () => {
    const mockScrollIntoView = vi.fn();
    const mockParentElement = {
      scrollIntoView: mockScrollIntoView,
    };
    const mockElement = {
      parentElement: mockParentElement,
      // No focus property
    };

    const mockQuerySelector = vi.fn().mockReturnValue(mockElement);
    Object.defineProperty(window, "document", {
      value: { querySelector: mockQuerySelector },
      writable: true,
    });

    scrollToSelector("#div-element");

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    // Should not crash and should not call focus
  });

  it("should not call focus if focus is not a function", () => {
    const mockScrollIntoView = vi.fn();
    const mockParentElement = {
      scrollIntoView: mockScrollIntoView,
    };
    const mockElement = {
      parentElement: mockParentElement,
      focus: "not a function", // focus exists but is not a function
    };

    const mockQuerySelector = vi.fn().mockReturnValue(mockElement);
    Object.defineProperty(window, "document", {
      value: { querySelector: mockQuerySelector },
      writable: true,
    });

    scrollToSelector("#weird-element");

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    // Should not crash and should not call focus
  });

  it("should handle complex selectors", () => {
    const mockFocus = vi.fn();
    const mockScrollIntoView = vi.fn();
    const mockParentElement = {
      scrollIntoView: mockScrollIntoView,
    };
    const mockElement = {
      parentElement: mockParentElement,
      focus: mockFocus,
    };

    const mockQuerySelector = vi.fn().mockReturnValue(mockElement);
    Object.defineProperty(window, "document", {
      value: { querySelector: mockQuerySelector },
      writable: true,
    });

    const complexSelector =
      'form[data-testid="contact-form"] input[name="email"]';
    scrollToSelector(complexSelector);

    expect(mockQuerySelector).toHaveBeenCalledWith(complexSelector);
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    expect(mockFocus).toHaveBeenCalled();
  });
});
