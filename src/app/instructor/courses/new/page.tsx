import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Sticker } from "@/components/neo";
import { CourseForm } from "@/components/course-form";

async function NewCourseContent() {
  // The proxy already checks the role, but every page checks it again on the server
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "INSTRUCTOR") redirect("/instructor");

  return (
    <>
      <Sticker className="bg-brand-green">New course</Sticker>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
        Create a course
      </h1>
      <CourseForm />
    </>
  );
}

export default function NewCoursePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/instructor" className="inline-block py-2 text-sm font-semibold underline">
        ← Back to your courses
      </Link>
      <div className="mt-4">
        <Suspense fallback={<p className="text-sm font-medium">Loading...</p>}>
          <NewCourseContent />
        </Suspense>
      </div>
    </main>
  );
}