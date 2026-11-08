import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/guards";

export async function GET() {
  const result = await requireRole(["INSTRUCTOR"]);
  if ("error" in result) return result.error;
  const { session } = result;

  // TODO: shudhu NIJER course. where({ instructorId: ______ }), tarpor
  // .select("id", "title", "slug", "published") ar .all()
  const courses = await db.orm.public.Course.where({instructorId: session.userId})
  .select("id", "title", "slug", "published")
  .all();

  return NextResponse.json({ courses });
}