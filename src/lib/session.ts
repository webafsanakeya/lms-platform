import "server-only";
import { cookies } from "next/headers";
import { signToken, verifyToken, SESSION_DAYS } from "./token";
import type { SessionPayload } from "./token";

export { verifyToken };
export type { SessionPayload };

export async function createSession(payload: SessionPayload) {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// Naya: cookie theke current session ber koro. Login na thakle null
export async function getSession() {
  const token = (await cookies()).get("session")?.value;
  return verifyToken(token);
}