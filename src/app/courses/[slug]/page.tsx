import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/prisma/db";
import { NeoCard, Sticker } from "@/components/neo";
import { formatPrice } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

async function CourseDetail({ params }: Props) {
  const { slug } = await params;

  const course = await db.orm.public.Course
    .where({ slug, published: true })
    .include("instructor", (u) => u.select("id", "name"))
    .first();

  if (!course) notFound();

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
      </div>

      <div>
        <NeoCard className="bg-brand-yellow p-6">
          <p className="text-sm font-medium">Price</p>
          <p className="mt-1 font-display text-4xl font-extrabold">
            {formatPrice(course.priceCents)}
          </p>
          {/* Day 10: replace this disabled button with a real Enroll button */}
          <button
            type="button"
            disabled
            className="mt-6 w-full cursor-not-allowed rounded-lg border-2 border-ink bg-white px-4 py-2 text-sm font-semibold opacity-70"
          >
            Enrollment coming soon
          </button>
        </NeoCard>
      </div>
    </div>
  );
}

export default function CoursePage({ params }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/courses" className="text-sm font-semibold underline">
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