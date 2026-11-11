import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/prisma/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.role}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {statLabel}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{statValue}</CardContent>
        </Card>
        <Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Account role
    </CardTitle>
  </CardHeader>
  <CardContent className="text-3xl font-semibold">{user.role}</CardContent>
</Card>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Course management and enrollment are coming soon.
      </p>
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl p-4">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}