import Link from "next/link";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export async function Navbar() {
  const session = await getSession();

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">LMS</Link>
        <div className="flex items-center gap-4 text-sm">
          {session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              {/* TODO: role-er link. INSTRUCTOR ba ADMIN hole /instructor,
                  shudhu ADMIN hole /admin. session.role === "ADMIN" diye check koro */}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}