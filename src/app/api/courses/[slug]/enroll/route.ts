import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/guards";

type Context = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, { params }: Context) {
  // Only logged-in students can enroll (401 if not logged in, 403 for other roles)
  const result = await requireRole(["STUDENT"]);
  if ("error" in result) return result.error;
  const { session } = result;

  const { slug } = await params;

  // Only published courses can be enrolled in; drafts look like they do not exist
  const course = await db.orm.public.Course
    .where({ slug, published: true })
    .select("id")
    .first();
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const alreadyEnrolled = async () =>
    (await db.orm.public.Enrollment
      .where({ userId: session.userId, courseId: course.id })
      .first()) !== null;

  if (await alreadyEnrolled()) {
    return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
  }

  try {
    // The user id comes from the signed session, never from the request body
    await db.orm.public.Enrollment.create({
      userId: session.userId,
      courseId: course.id,
    });
  } catch (error) {
    // Two requests at the same time: the unique (userId, courseId) constraint
    // rejects the second one. Treat that as "already enrolled".
    if (await alreadyEnrolled()) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }
    throw error;
  }

  return NextResponse.json({ enrolled: true }, { status: 201 });
}