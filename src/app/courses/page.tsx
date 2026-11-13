import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/prisma/db";
import { NeoCard, Sticker } from "@/components/neo";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Courses | LMS Platform",
  description: "Browse the published courses on the LMS platform.",
};

const headerColors = [
  "bg-brand-blue text-white",
  "bg-brand-green text-ink",
  "bg-brand-yellow text-ink",
  "bg-brand-purple text-white",
];

async function CourseGrid() {
    await connection();
    
  const courses = await db.orm.public.Course
    .where({ published: true })
    .orderBy((c) => c.createdAt.desc())
    .include("instructor", (u) => u.select("id", "name"))
    .all();

  if (courses.length === 0) {
    return (
      <p className="mt-10 inline-block border-2 border-dashed border-ink px-3 py-2 text-sm">
        No published courses yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, i) => (
        <Link
          key={course.id}
          href={`/courses/${course.slug}`}
          className="group block"
        >
          <NeoCard className="flex h-full flex-col overflow-hidden p-0 transition group-hover:-translate-y-1">
            <div
              className={cn(
                "border-b-2 border-ink p-4",
                headerColors[i % headerColors.length],
              )}
            >
              <h2 className="font-display text-xl font-bold">{course.title}</h2>
              <p className="mt-1 text-xs">
  By {course.instructor?.name ?? "Unknown instructor"}
</p>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="line-clamp-3 text-sm">{course.description}</p>
              <span className="mt-4 self-start border-2 border-ink bg-brand-yellow px-2 py-0.5 text-sm font-semibold">
                {formatPrice(course.priceCents)}
              </span>
            </div>
          </NeoCard>
        </Link>
      ))}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Sticker className="bg-brand-green">Catalog</Sticker>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Browse courses
      </h1>
      <Suspense
        fallback={<p className="mt-10 text-sm font-medium">Loading courses...</p>}
      >
        <CourseGrid />
      </Suspense>
    </main>
  );
}