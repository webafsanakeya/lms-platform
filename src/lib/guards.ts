import "server-only";
import { NextResponse } from "next/server";
import { getSession } from "./session";
import type { Role } from "./token";

// API route-er shurute chalao. Login/role thik na hole { error } ferot dey
export async function requireRole(allowed: Role[]) {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }
  if (!allowed.includes(session.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}