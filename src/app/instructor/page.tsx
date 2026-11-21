import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/prisma/db";
import { NeoCard, Sticker } from "@/components/neo";
import { PublishToggle } from "@/components/publish-toggle";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

async function InstructorContent() {
  // The proxy already redirects, but every page checks the role again on the server
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "INSTRUCTOR" && session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const isAdmin = session.role === "ADMIN";

  // Instructors only ever see their own courses; admins see all of them
  const courses = isAdmin
    ? await db.orm.public.Course
        .select("id", "title", "slug", "published", "priceCents")
        .orderBy((c) => c.id.asc())
        .all()
    : await db.orm.public.Course
        .where({ instructorId: session.userId })
        .select("id", "title", "slug", "published", "priceCents")
        .orderBy((c) => c.id.asc())
        .all();

  return (
    <>
      <Sticker className="bg-brand-green">Instructor</Sticker>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
        {isAdmin ? "All courses" : "Your courses"}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {!isAdmin && (
          <Link
            href="/instructor/courses/new"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-lg border-2 border-ink bg-brand-blue font-semibold text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
            )}
          >
            + New course
          </Link>
        )}
        <p className="text-sm">
          {courses.length} {courses.length === 1 ? "course" : "courses"}
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="mt-8 inline-block border-2 border-dashed border-ink px-3 py-2 text-sm">
          You do not have any courses yet. Create your first one.
        </p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {courses.map((c) => (
            <li key={c.id}>
              <NeoCard className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-bold">{c.title}</h2>
                  <span
                    className={cn(
                      "shrink-0 border-2 border-ink px-2 py-0.5 text-xs font-semibold",
                      c.published ? "bg-brand-green" : "bg-brand-yellow",
                    )}
                  >
                    {c.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-2 text-sm">{formatPrice(c.priceCents)}</p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {c.published ? (
                    <Link
                      href={`/courses/${c.slug}`}
                      className="inline-block py-1 text-sm font-semibold underline"
                    >
                      View public page
                    </Link>
                  ) : (
                    <p className="text-xs">Not visible to students yet.</p>
                  )}
                  {!isAdmin && (
                    <PublishToggle slug={c.slug} published={c.published} />
                  )}
                </div>
              </NeoCard>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function InstructorPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Suspense fallback={<p className="text-sm font-medium">Loading...</p>}>
        <InstructorContent />
      </Suspense>
    </main>
  );
}