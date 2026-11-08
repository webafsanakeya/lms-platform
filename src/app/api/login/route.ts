import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/prisma/db";
import { loginSchema } from "@/lib/validations";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  const { password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  const user = await db.orm.public.User.where({ email }).first();
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  await createSession({ userId: user.id, role: user.role });

  return NextResponse.json(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    { status: 200 },
  );
}