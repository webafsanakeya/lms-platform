import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) throw new Error("SESSION_SECRET is not set in .env");
const key = new TextEncoder().encode(secretKey);

const SESSION_DAYS = 7;

export type SessionPayload = {
  userId: number;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
};

// Token toiri koro ar chabi diye sign koro
export async function signToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(key);
}

// Token thik ki na dekho. Vul ba expired hole null
export async function verifyToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Login-er por cookie set koro
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

// Logout-er jonno cookie muche dao
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}