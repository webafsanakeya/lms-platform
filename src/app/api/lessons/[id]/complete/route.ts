import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/guards";

type Context = { params: Promise<{ id: string }> };

// Mark a lesson as completed for the logged-in student
export async function POST(_request: Request, { params }: Context) {
  // Only students track progress (401 if not logged in, 403 for other roles)
  const result = await requireRole(["STUDENT"]);
  if ("error" in result) return result.error;
  const { session } = result;

  const { id } = await params;
  const lessonId = Number(id);
  if (!Number.isInteger(lessonId) || lessonId <= 0) {
    return NextResponse.json({ error: "Invalid lesson id" }, { status: 400 });
  }

  const lesson = await db.orm.public.Lesson
    .where({ id: lessonId })
    .select("id", "courseId")
    .first();
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // A student can only complete lessons of a course they are enrolled in
  const enrollment = await db.orm.public.Enrollment
    .where({ userId: session.userId, courseId: lesson.courseId })
    .first();
  if (!enrollment) {
    return NextResponse.json(
      { error: "Enroll in this course first" },
      { status: 403 },
    );
  }

  // The user id comes from the signed session, never from the request body
  const alreadyDone = async () =>
    (await db.orm.public.LessonProgress
      .where({ userId: session.userId, lessonId })
      .first()) !== null;

  // Completing a lesson twice is not an error: it just stays completed
  if (await alreadyDone()) {
    return NextResponse.json({ completed: true });
  }

  try {
    await db.orm.public.LessonProgress.create({
      userId: session.userId,
      lessonId,
    });
  } catch (error) {
    // Two requests at the same time: the unique (userId, lessonId) constraint stopped one
    if (await alreadyDone()) {
      return NextResponse.json({ completed: true });
    }
    throw error;
  }

  return NextResponse.json({ completed: true }, { status: 201 });
}