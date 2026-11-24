import { describe, it, expect } from "vitest";
import { createLessonSchema } from "./lesson";

describe("createLessonSchema", () => {
  const valid = {
    title: "Variables and types",
    content: "A variable is a named place to keep a value.",
  };

  it("accepts a valid lesson", () => {
    expect(createLessonSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a short title", () => {
    expect(createLessonSchema.safeParse({ ...valid, title: "Hi" }).success).toBe(false);
  });

  it("rejects content that is too short", () => {
    expect(createLessonSchema.safeParse({ ...valid, content: "Short" }).success).toBe(false);
  });

  it("trims spaces before checking the length", () => {
    expect(
      createLessonSchema.safeParse({ ...valid, title: "   ab   " }).success,
    ).toBe(false);
  });

  it("rejects a missing field", () => {
    expect(createLessonSchema.safeParse({ title: valid.title }).success).toBe(false);
  });
});