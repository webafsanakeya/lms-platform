import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/guards";

const bodySchema = z.object({
  role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]),
});

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  // Only admins (401 if not logged in, 403 for any other role)
  const result = await requireRole(["ADMIN"]);
  if ("error" in result) return result.error;
  const { session } = result;

  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  // An admin cannot change their own role, so nobody can lock themselves out
  if (userId === session.userId) {
    return NextResponse.json(
      { error: "You cannot change your own role" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const updated = await db.orm.public.User
    .where({ id: userId })
    .update({ role: parsed.data.role });

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Never return the password hash
  return NextResponse.json({ id: updated.id, role: updated.role });
}