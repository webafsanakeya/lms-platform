import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/prisma/db";
import { getSession } from "@/lib/session";
import { NeoCard, Sticker } from "@/components/neo";
import { EnrollButton } from "@/components/enroll-button";
import { ProgressBar } from "@/components/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { connection } from "next/server";

type Props = { params: Promise<{ slug: string }> };

async function CourseDetail({ params }: Props) {
  await connection();
  const { slug } = await params;

  const course = await db.orm.public.Course
    .where({ slug, published: true })
    .include("instructor", (u) => u.select("id", "name"))
    .first();

  if (!course) notFound();

  const session = await getSession();

  let enrolled = false;
  if (session?.role === "STUDENT") {
    const existing = await db.orm.public.Enrollment
      .where({ userId: session.userId, courseId: course.id })
      .first();
    enrolled = existing !== null;
  }

  // Everyone can see the list of lessons; only these people can open them
  const isOwner = session?.userId === course.instructorId;
  const isAdmin = session?.role === "ADMIN";
  const canOpenLessons = enrolled || isOwner || isAdmin;

  const lessons = await db.orm.public.Lesson
    .where({ courseId: course.id })
    .select("id", "title", "position")
    .orderBy((l) => l.position.asc())
    .all();

  let doneIds = new Set<number>();
  if (enrolled && session && lessons.length > 0) {
    const rows = await db.orm.public.LessonProgress
      .where({ userId: session.userId })
      .where((p) => p.lessonId.in(lessons.map((l) => l.id)))
      .select("lessonId")
      .all();
    doneIds = new Set(rows.map((r) => r.lessonId));
  }

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Sticker className="bg-brand-purple text-white">Course</Sticker>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          {course.title}
        </h1>
        <p className="mt-3 text-sm font-medium">
          Taught by {course.instructor?.name ?? "Unknown instructor"}
        </p>
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed">
          {course.description}
        </p>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-extrabold">Lessons</h2>

          {enrolled && lessons.length > 0 && (
            <div className="mt-3 max-w-md">
              <ProgressBar done={doneIds.size} total={lessons.length} />
            </div>
          )}

          {lessons.length === 0 ? (
            <p className="mt-4 inline-block border-2 border-dashed border-ink px-3 py-2 text-sm">
              Lessons are coming soon.
            </p>
          ) : (
            <ol className="mt-4 space-y-3">
              {lessons.map((l) => {
                const row = (
                  <NeoCard className="flex items-center gap-4 p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-brand-yellow font-display font-extrabold">
                      {doneIds.has(l.id) ? "✓" : l.position}
                    </span>
                    <span className="font-medium">{l.title}</span>
                    {!canOpenLessons && (
                      <span className="ml-auto shrink-0 border-2 border-ink bg-white px-2 py-0.5 text-xs font-semibold">
                        Enroll to unlock
                      </span>
                    )}
                  </NeoCard>
                );

                return (
                  <li key={l.id}>
                    {canOpenLessons ? (
                      <Link
                        href={`/courses/${course.slug}/lessons/${l.position}`}
                        className="block transition hover:-translate-y-0.5"
                      >
                        {row}
                      </Link>
                    ) : (
                      row
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>

      <div>
        <NeoCard className="bg-brand-yellow p-6">
          <p className="text-sm font-medium">Price</p>
          <p className="mt-1 font-display text-4xl font-extrabold">
            {formatPrice(course.priceCents)}
          </p>

          {!session ? (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 w-full rounded-lg border-2 border-ink bg-brand-blue font-semibold text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
              )}
            >
              Log in to enroll
            </Link>
          ) : session.role !== "STUDENT" ? (
            <p className="mt-6 border-2 border-dashed border-ink px-3 py-2 text-sm">
              Only student accounts can enroll in courses.
            </p>
          ) : enrolled ? (
            <p className="mt-6 border-2 border-ink bg-brand-green px-3 py-2 text-sm font-semibold">
              ✓ You are enrolled
            </p>
          ) : (
            <EnrollButton slug={course.slug} />
          )}
        </NeoCard>
      </div>
    </div>
  );
}

export default function CoursePage({ params }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/courses" className="inline-block py-2 text-sm font-semibold underline">
        ← All courses
      </Link>
      <Suspense
        fallback={<p className="mt-6 text-sm font-medium">Loading course...</p>}
      >
        <CourseDetail params={params} />
      </Suspense>
    </main>
  );
}