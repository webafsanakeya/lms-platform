import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/session";

export async function GET() {
  const token = (await cookies()).get("session")?.value;
  const session = await verifyToken(token);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ userId: session.userId, role: session.role });
}