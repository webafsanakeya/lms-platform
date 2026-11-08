import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/guards";

export async function GET() {
  const result = await requireRole(["ADMIN"]);
  if ("error" in result) return result.error;

  const users = await db.orm.public.User.select("id", "name", "email", "role").all();
  return NextResponse.json({ users });
}