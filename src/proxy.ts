import { NextResponse, type NextRequest } from "next/server";
import { verifyToken, type Role } from "@/lib/token";

const rules: { prefix: string; roles: Role[] }[] = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/instructor", roles: ["INSTRUCTOR", "ADMIN"] },
  { prefix: "/dashboard", roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rule = rules.find(
    (r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/"),
  );
  if (!rule) return NextResponse.next();

  const token = request.cookies.get("session")?.value;
  const session = await verifyToken(token);

  // Login nei: login page-e pathao
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // TODO: login ache kintu role allowed na. Redirect koro "/dashboard"-e.
   if (!rule.roles.includes(session.role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*", "/dashboard/:path*"],
};