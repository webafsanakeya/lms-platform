import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/guards";
import { createCourseSchema, slugify } from "@/lib/course";

// List the logged-in instructor's own courses
export async function GET() {
  const result = await requireRole(["INSTRUCTOR"]);
  if ("error" in result) return result.error;
  const { session } = result;

  const courses = await db.orm.public.Course
    .where({ instructorId: session.userId })
    .select("id", "title", "slug", "published")
    .all();

  return NextResponse.json({ courses });
}

const slugTaken = async (slug: string) =>
  (await db.orm.public.Course.where({ slug }).select("id").first()) !== null;

// Create a course owned by the logged-in instructor
export async function POST(request: Request) {
  const result = await requireRole(["INSTRUCTOR"]);
  if ("error" in result) return result.error;
  const { session } = result;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createCourseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const { title, description, priceCents, published } = parsed.data;

  // Build a unique URL: react-basics, react-basics-2, react-basics-3, ...
  const base = slugify(title) || "course";
  let slug = base;
  for (let n = 2; await slugTaken(slug); n++) {
    if (n > 50) {
      return NextResponse.json(
        { error: "Could not create a unique URL, try a different title" },
        { status: 409 },
      );
    }
    slug = `${base}-${n}`;
  }

  try {
    const course = await db.orm.public.Course.create({
      title,
      slug,
      description,
      priceCents,
      published,
      // The owner comes from the signed session, never from the request body
      instructorId: session.userId,
    });
    return NextResponse.json(
      { id: course.id, slug: course.slug, published: course.published },
      { status: 201 },
    );
  } catch (error) {
    // Two requests picked the same slug at the same time: the unique constraint stopped one
    if (await slugTaken(slug)) {
      return NextResponse.json(
        { error: "That URL was just taken, please try again" },
        { status: 409 },
      );
    }
    throw error;
  }
}