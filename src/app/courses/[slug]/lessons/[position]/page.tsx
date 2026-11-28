import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/prisma/db";
import { NeoCard, Sticker } from "@/components/neo";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import { ProgressBar } from "@/components/progress-bar";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string; position: string }> };

async function LessonContent({ params }: Props) {
  const { slug, position: positionParam } = await params;
  const position = Number(positionParam);
  if (!Number.isInteger(position) || position < 1) notFound();

  const session = await getSession();
  if (!session) redirect("/login");

  const course = await db.orm.public.Course
    .where({ slug })
    .select("id", "title", "slug", "instructorId", "published")
    .first();
  if (!course) notFound();

  const isOwner = session.userId === course.instructorId;
  const isAdmin = session.role === "ADMIN";
  const isStudent = session.role === "STUDENT";

  let enrolled = false;
  if (isStudent) {
    const enrollment = await db.orm.public.Enrollment
      .where({ userId: session.userId, courseId: course.id })
      .first();
    enrolled = enrollment !== null;
  }

  // Lesson content is only for enrolled students, the course owner and admins
  if (!isOwner && !isAdmin && !enrolled) {
    if (course.published) redirect(`/courses/${course.slug}`);
    notFound();
  }

  const lessons = await db.orm.public.Lesson
    .where({ courseId: course.id })
    .select("id", "title", "position")
    .orderBy((l) => l.position.asc())
    .all();

  const lesson = await db.orm.public.Lesson
    .where({ courseId: course.id, position })
    .first();
  if (!lesson) notFound();

  // Which lessons has this student finished?
  let doneIds = new Set<number>();
  if (isStudent && lessons.length > 0) {
    const rows = await db.orm.public.LessonProgress
      .where({ userId: session.userId })
      .where((p) => p.lessonId.in(lessons.map((l) => l.id)))
      .select("lessonId")
      .all();
    doneIds = new Set(rows.map((r) => r.lessonId));
  }

  const completed = doneIds.has(lesson.id);
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const previous = index > 0 ? lessons[index - 1] : undefined;
  const next = index < lessons.length - 1 ? lessons[index + 1] : undefined;

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Sticker className="bg-brand-purple text-white">
          Lesson {index + 1} of {lessons.length}
        </Sticker>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
          {lesson.title}
        </h1>

        <NeoCard className="mt-6 p-6">
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {lesson.content}
          </div>
        </NeoCard>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {isStudent &&
            (completed ? (
              <p className="border-2 border-ink bg-brand-green px-3 py-2 text-sm font-semibold">
                ✓ Completed
              </p>
            ) : (
              <MarkCompleteButton lessonId={lesson.id} />
            ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-4 text-sm font-semibold">
          {previous ? (
            <Link
              href={`/courses/${course.slug}/lessons/${previous.position}`}
              className="inline-block py-2 underline"
            >
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/courses/${course.slug}/lessons/${next.position}`}
              className="inline-block py-2 underline"
            >
              {next.title} →
            </Link>
          )}
        </div>
      </div>

      <aside>
        <NeoCard className="bg-brand-lilac p-5">
          <p className="font-display text-lg font-bold">{course.title}</p>
          {isStudent && (
            <div className="mt-3">
              <ProgressBar done={doneIds.size} total={lessons.length} />
            </div>
          )}
          <ol className="mt-4 space-y-2">
            {lessons.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/courses/${course.slug}/lessons/${l.position}`}
                  className={cn(
                    "flex items-center gap-3 border-2 border-ink bg-white px-3 py-2 text-sm font-medium",
                    l.id === lesson.id && "bg-brand-yellow",
                  )}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink text-xs font-bold">
                    {doneIds.has(l.id) ? "✓" : l.position}
                  </span>
                  {l.title}
                </Link>
              </li>
            ))}
          </ol>
        </NeoCard>
      </aside>
    </div>
  );
}

export default function LessonPage({ params }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Suspense fallback={<p className="text-sm font-medium">Loading lesson...</p>}>
        <BackLink params={params} />
        <LessonContent params={params} />
      </Suspense>
    </main>
  );
}

async function BackLink({ params }: Props) {
  const { slug } = await params;
  return (
    <Link
      href={`/courses/${slug}`}
      className="inline-block py-2 text-sm font-semibold underline"
    >
      ← Back to the course
    </Link>
  );
}