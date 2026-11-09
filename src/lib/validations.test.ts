import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "./validations";

describe("registerSchema", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({
      name: "Keya",
      email: "keya@test.com",
      password: "Password123!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short name", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "keya@test.com",
      password: "Password123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Name must be at least 2 characters",
      );
    }
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Keya",
      email: "not-an-email",
      password: "Password123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result = registerSchema.safeParse({
      name: "Keya",
      email: "keya@test.com",
      password: "123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Password must be at least 8 characters",
      );
    }
  });

  it("rejects a missing name", () => {
    const result = registerSchema.safeParse({
      email: "keya@test.com",
      password: "Password123!",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid input", () => {
    const result = loginSchema.safeParse({
      email: "keya@test.com",
      password: "anything",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "anything",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "keya@test.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
