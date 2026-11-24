import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/guards";
import { createLessonSchema } from "@/lib/lesson";

type Context = { params: Promise<{ slug: string }> };

// Only returns the course when it belongs to this instructor. Someone else's
// course looks exactly like a course that does not exist.
function ownCourse(slug: string, instructorId: number) {
  return db.orm.public.Course
    .where({ slug, instructorId })
    .select("id")
    .first();
}

export async function GET(_request: Request, { params }: Context) {
  const result = await requireRole(["INSTRUCTOR"]);
  if ("error" in result) return result.error;
  const { session } = result;

  const { slug } = await params;
  const course = await ownCourse(slug, session.userId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const lessons = await db.orm.public.Lesson
    .where({ courseId: course.id })
    .select("id", "title", "position")
    .orderBy((l) => l.position.asc())
    .all();

  return NextResponse.json({ lessons });
}

export async function POST(request: Request, { params }: Context) {
  const result = await requireRole(["INSTRUCTOR"]);
  if ("error" in result) return result.error;
  const { session } = result;

  const { slug } = await params;
  const course = await ownCourse(slug, session.userId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createLessonSchema.safeParse(body);
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

  const { title, content } = parsed.data;

  // The new lesson goes at the end of the course: last position + 1.
  // If two lessons are added at the same moment, the unique (courseId, position)
  // constraint rejects one of them, so we try once more with a fresh position.
  for (let attempt = 0; attempt < 2; attempt++) {
    const [last] = await db.orm.public.Lesson
      .where({ courseId: course.id })
      .select("position")
      .orderBy((l) => l.position.desc())
      .limit(1)
      .all();
    const position = (last?.position ?? 0) + 1;

    try {
      const lesson = await db.orm.public.Lesson.create({
        title,
        content,
        position,
        courseId: course.id,
      });
      return NextResponse.json(
        { id: lesson.id, position: lesson.position },
        { status: 201 },
      );
    } catch (error) {
      if (attempt === 1) throw error;
    }
  }

  return NextResponse.json({ error: "Could not create the lesson" }, { status: 500 });
}