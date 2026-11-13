import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/prisma/db";
import { NeoCard } from "@/components/neo";

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

  if (session.role === "STUDENT") {
    const rows = await db.orm.public.Enrollment
      .where({ userId: session.userId })
      .select("id")
      .all();
    statLabel = "Enrolled courses";
    statValue = rows.length;
  } else if (session.role === "INSTRUCTOR") {
    const rows = await db.orm.public.Course
      .where({ instructorId: session.userId })
      .select("id")
      .all();
    statLabel = "Your courses";
    statValue = rows.length;
  } else {
    const rows = await db.orm.public.User.select("id").all();
    statValue = rows.length;
  }

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
        <NeoCard className="bg-brand-green p-6">
          <p className="text-sm font-medium">Account role</p>
          <p className="mt-2 font-display text-3xl font-extrabold">{user.role}</p>
        </NeoCard>
      </div>

      <p className="mt-8 inline-block border-2 border-dashed border-ink px-3 py-2 text-sm">
        Course management and enrollment are coming soon.
      </p>
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