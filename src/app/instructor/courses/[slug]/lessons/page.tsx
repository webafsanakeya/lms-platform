import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/prisma/db";
import { NeoCard, Sticker } from "@/components/neo";
import { LessonForm } from "@/components/lesson-form";

type Props = { params: Promise<{ slug: string }> };

async function LessonsContent({ params }: Props) {
  const { slug } = await params;

  // The proxy already checks the role, but every page checks it again on the server
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "INSTRUCTOR") redirect("/instructor");

  // Only the owner can manage a course's lessons
  const course = await db.orm.public.Course
    .where({ slug, instructorId: session.userId })
    .select("id", "title", "slug")
    .first();
  if (!course) notFound();

  const lessons = await db.orm.public.Lesson
    .where({ courseId: course.id })
    .select("id", "title", "position")
    .orderBy((l) => l.position.asc())
    .all();

  return (
    <>
      <Sticker className="bg-brand-purple text-white">Lessons</Sticker>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
        {course.title}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl font-extrabold">
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
          </h2>
          {lessons.length === 0 ? (
            <p className="mt-4 inline-block border-2 border-dashed border-ink px-3 py-2 text-sm">
              No lessons yet. Add the first one.
            </p>
          ) : (
            <ol className="mt-4 space-y-3">
              {lessons.map((l) => (
                <li key={l.id}>
                  <NeoCard className="flex items-center gap-4 p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-brand-yellow font-display font-extrabold">
                      {l.position}
                    </span>
                    <span className="font-medium">{l.title}</span>
                  </NeoCard>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section>
          <h2 className="font-display text-2xl font-extrabold">Add a lesson</h2>
          <LessonForm slug={course.slug} />
        </section>
      </div>
    </>
  );
}

export default function LessonsPage({ params }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/instructor"
        className="inline-block py-2 text-sm font-semibold underline"
      >
        ← Back to your courses
      </Link>
      <div className="mt-4">
        <Suspense fallback={<p className="text-sm font-medium">Loading...</p>}>
          <LessonsContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}