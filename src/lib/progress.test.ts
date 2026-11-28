import { describe, it, expect } from "vitest";
import { progressPercent } from "./progress";

describe("progressPercent", () => {
  it("returns 0 when there are no lessons", () => {
    expect(progressPercent(0, 0)).toBe(0);
  });

  it("rounds to the nearest whole percent", () => {
    expect(progressPercent(1, 3)).toBe(33);
    expect(progressPercent(2, 3)).toBe(67);
  });

  it("returns 100 when everything is done", () => {
    expect(progressPercent(3, 3)).toBe(100);
  });

  it("never goes above 100", () => {
    expect(progressPercent(5, 3)).toBe(100);
  });

  it("never goes below 0", () => {
    expect(progressPercent(-1, 3)).toBe(0);
  });
});