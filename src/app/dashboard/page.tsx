import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/prisma/db";
import { NeoCard } from "@/components/neo";
import { ProgressBar } from "@/components/progress-bar";

type MyCourse = { id: number; title: string; slug: string };

async function DashboardContent() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db.orm.public.User
    .where({ id: session.userId })
    .select("name", "role")
    .first();
  if (!user) redirect("/login");

  let statLabel = "Registered users";
  let statValue = 0;
  let myCourses: MyCourse[] = [];

  // Students: lesson progress per course
  let completedLessons = 0;
  const progress = new Map<number, { done: number; total: number }>();

  if (session.role === "STUDENT") {
    const enrollments = await db.orm.public.Enrollment
      .where({ userId: session.userId })
      .orderBy((e) => e.createdAt.desc())
      .include("course", (c) => c.select("id", "title", "slug"))
      .all();
    myCourses = enrollments.flatMap((e) => (e.course ? [e.course] : []));
    statLabel = "Enrolled courses";
    statValue = myCourses.length;

    const courseIds = myCourses.map((c) => c.id);
    if (courseIds.length > 0) {
      const lessons = await db.orm.public.Lesson
        .where((l) => l.courseId.in(courseIds))
        .select("id", "courseId")
        .all();
      const doneRows = await db.orm.public.LessonProgress
        .where({ userId: session.userId })
        .select("lessonId")
        .all();
      const doneIds = new Set(doneRows.map((r) => r.lessonId));

      for (const l of lessons) {
        const entry = progress.get(l.courseId) ?? { done: 0, total: 0 };
        entry.total += 1;
        if (doneIds.has(l.id)) {
          entry.done += 1;
          completedLessons += 1;
        }
        progress.set(l.courseId, entry);
      }
    }
  } else if (session.role === "INSTRUCTOR") {
    const rows = await db.orm.public.Course
      .where({ instructorId: session.userId })
      .select("id", "title", "slug")
      .all();
    myCourses = rows;
    statLabel = "Your courses";
    statValue = rows.length;
  } else {
    const rows = await db.orm.public.User.select("id").all();
    statValue = rows.length;
  }

  const isStudent = session.role === "STUDENT";

  return (
    <>
      <h1 className="font-display text-4xl font-extrabold tracking-tight">
        Welcome, {user.name}
      </h1>
      <span className="mt-3 inline-block border-2 border-ink bg-brand-yellow px-2 py-0.5 text-sm font-semibold">
        {user.role}
      </span>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <NeoCard className="bg-brand-blue p-6 text-white">
          <p className="text-sm font-medium">{statLabel}</p>
          <p className="mt-2 font-display text-5xl font-extrabold">{statValue}</p>
        </NeoCard>
        {isStudent ? (
          <NeoCard className="bg-brand-green p-6">
            <p className="text-sm font-medium">Lessons completed</p>
            <p className="mt-2 font-display text-5xl font-extrabold">
              {completedLessons}
            </p>
          </NeoCard>
        ) : (
          <NeoCard className="bg-brand-green p-6">
            <p className="text-sm font-medium">Account role</p>
            <p className="mt-2 font-display text-3xl font-extrabold">{user.role}</p>
          </NeoCard>
        )}
      </div>

      {session.role !== "ADMIN" && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold">
            {isStudent ? "My courses" : "Courses you teach"}
          </h2>

          {myCourses.length === 0 ? (
            <p className="mt-4 inline-block border-2 border-dashed border-ink px-3 py-2 text-sm">
              {isStudent
                ? "You have not enrolled in a course yet."
                : "You have no courses yet."}{" "}
              <Link href="/courses" className="font-semibold underline">
                Browse courses
              </Link>
            </p>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {myCourses.map((c) => {
                const p = progress.get(c.id);
                return (
                  <li key={c.id}>
                    <Link href={`/courses/${c.slug}`} className="block">
                      <NeoCard className="p-4 transition hover:-translate-y-1">
                        <p className="font-display text-lg font-bold">{c.title}</p>
                        {isStudent && (
                          <div className="mt-3">
                            {p && p.total > 0 ? (
                              <ProgressBar done={p.done} total={p.total} />
                            ) : (
                              <p className="text-xs">No lessons yet</p>
                            )}
                          </div>
                        )}
                        <p className="mt-3 text-xs underline">
                          {isStudent ? "Continue learning" : "View course"}
                        </p>
                      </NeoCard>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Suspense
        fallback={<p className="text-sm font-medium">Loading your dashboard...</p>}
      >
        <DashboardContent />
      </Suspense>
    </main>
  );
}