import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/prisma/db";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  // 1. Body pora. Vul JSON hole 400
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 2. Zod diye jachai
  const parsed = registerSchema.safeParse(body);
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
  const { name, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

// Step A: ei email diye age-i user ache kina dekho

const existingUser = await db.orm.public.User.where({email}).first();
if (existingUser) {
    return NextResponse.json(
        {error: "Email already registered"},
        {status: 409},
    );
}

 // Step B: password hash koro

 const passwordHash = await bcrypt.hash(password, 10);

  // Step C: notun user toiri koro

  const user = await db.orm.public.User.create({
    name,
    email,
    passwordHash,
    role: "STUDENT",
  });

  // 4. passwordHash bad diye ferot dao
  return NextResponse.json(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    { status: 201 },
  );
}