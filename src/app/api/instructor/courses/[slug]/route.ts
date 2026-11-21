import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/guards";

const bodySchema = z.object({ published: z.boolean() });

type Context = { params: Promise<{ slug: string }> };

// Publish or unpublish one of the instructor's own courses
export async function PATCH(request: Request, { params }: Context) {
  const result = await requireRole(["INSTRUCTOR"]);
  if ("error" in result) return result.error;
  const { session } = result;

  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Ownership: match the slug AND the owner. Someone else's course answers
  // 404, the same as a course that does not exist, so nothing is leaked.
  const updated = await db.orm.public.Course
    .where({ slug, instructorId: session.userId })
    .update({ published: parsed.data.published });

  if (!updated) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({ slug: updated.slug, published: updated.published });
}