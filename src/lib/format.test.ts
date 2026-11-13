import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("shows Free for zero", () => {
    expect(formatPrice(0)).toBe("Free");
  });

  it("formats cents as dollars", () => {
    expect(formatPrice(1999)).toBe("$19.99");
  });

  it("keeps two decimals", () => {
    expect(formatPrice(500)).toBe("$5.00");
  });

  it("treats a negative price as Free", () => {
    expect(formatPrice(-100)).toBe("Free");
  });
});