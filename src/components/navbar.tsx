import Link from "next/link";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function Navbar() {
  const session = await getSession();
  const canSeeInstructor =
    session?.role === "INSTRUCTOR" || session?.role === "ADMIN";

  return (
    <nav className="border-b-2 border-ink bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-display text-xl font-extrabold"
        >
          <span
            aria-hidden
            className="h-5 w-5 rotate-12 border-2 border-ink bg-brand-yellow"
          />
          LMS
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-sm font-medium sm:gap-x-5">
          <Link href="/courses" className="inline-block py-2 hover:underline">
            Courses
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="inline-block py-2 hover:underline">
                Dashboard
              </Link>
              {canSeeInstructor && (
                <Link href="/instructor" className="inline-block py-2 hover:underline">
                  Instructor
                </Link>
              )}
              {session.role === "ADMIN" && (
                <Link href="/admin" className="inline-block py-2 hover:underline">
                  Admin
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="inline-block py-2 hover:underline">
                Log in
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-lg border-2 border-ink bg-brand-blue font-semibold text-white shadow-[2px_2px_0_0_#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
                )}
              >
                Sign up free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
