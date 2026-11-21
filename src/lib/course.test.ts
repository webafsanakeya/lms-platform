import { describe, it, expect } from "vitest";
import { slugify, dollarsToCents, createCourseSchema } from "./course";

describe("slugify", () => {
  it("lowercases and joins words with dashes", () => {
    expect(slugify("React Basics")).toBe("react-basics");
  });

  it("removes punctuation and extra spaces", () => {
    expect(slugify("  Hello,   World!! ")).toBe("hello-world");
  });

  it("removes accents", () => {
    expect(slugify("Café Déjà vu")).toBe("cafe-deja-vu");
  });

  it("returns an empty string when nothing usable is left", () => {
    expect(slugify("!!!")).toBe("");
  });

  it("limits the length and never ends with a dash", () => {
    const slug = slugify("word ".repeat(40));
    expect(slug.length).toBeLessThanOrEqual(60);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("dollarsToCents", () => {
  it("converts dollars to cents", () => {
    expect(dollarsToCents("19.99")).toBe(1999);
  });

  it("treats an empty input as free", () => {
    expect(dollarsToCents("")).toBe(0);
    expect(dollarsToCents("   ")).toBe(0);
  });

  it("ignores spaces around the number", () => {
    expect(dollarsToCents(" 5 ")).toBe(500);
  });

  it("returns NaN for text", () => {
    expect(Number.isNaN(dollarsToCents("abc"))).toBe(true);
  });
});

describe("createCourseSchema", () => {
  const valid = {
    title: "TypeScript Essentials",
    description: "Types, interfaces and generics for everyday projects.",
    priceCents: 1999,
    published: false,
  };

  it("accepts a valid course", () => {
    expect(createCourseSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a short title", () => {
    expect(createCourseSchema.safeParse({ ...valid, title: "Hi" }).success).toBe(false);
  });

  it("rejects a short description", () => {
    expect(
      createCourseSchema.safeParse({ ...valid, description: "Too short" }).success,
    ).toBe(false);
  });

  it("rejects a negative price", () => {
    expect(createCourseSchema.safeParse({ ...valid, priceCents: -1 }).success).toBe(false);
  });

  it("rejects a price that is not a whole number of cents", () => {
    expect(createCourseSchema.safeParse({ ...valid, priceCents: 10.5 }).success).toBe(false);
  });

  it("requires the published flag", () => {
    const { published, ...withoutPublished } = valid;
    void published;
    expect(createCourseSchema.safeParse(withoutPublished).success).toBe(false);
  });
});