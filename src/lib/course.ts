import { z } from "zod";

// "React Basics!" -> "react-basics". Used for the course URL.
export function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-") // anything else becomes a dash
    .replace(/^-+|-+$/g, "") // no dash at the start or end
    .slice(0, 60)
    .replace(/-+$/g, ""); // cutting at 60 may leave a trailing dash
}

// The form asks for dollars ("19.99"), the database stores cents (1999).
// An empty input means a free course. Returns NaN for text that is not a number.
export function dollarsToCents(input: string) {
  const text = input.trim();
  if (text === "") return 0;
  const value = Number(text);
  if (!Number.isFinite(value)) return NaN;
  return Math.round(value * 100);
}

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title must be at most 80 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be at most 2000 characters"),
  priceCents: z
    .number()
    .int("Price must be a whole number of cents")
    .min(0, "Price cannot be negative")
    .max(1000000, "Price cannot be more than $10,000"),
  published: z.boolean(),
});