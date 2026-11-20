import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/prisma/db";
import { NeoCard, Sticker } from "@/components/neo";
import { RoleSelect } from "@/components/role-select";
import { cn } from "@/lib/utils";

async function AdminContent() {
  // The proxy already redirects, but every page checks the role again on the server
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  const users = await db.orm.public.User
    .select("id", "name", "email", "role")
    .orderBy((u) => u.id.asc())
    .all();

  const [userCount, courseCount, enrollmentCount] = await Promise.all([
    db.orm.public.User.aggregate((a) => ({ total: a.count() })),
    db.orm.public.Course.aggregate((a) => ({ total: a.count() })),
    db.orm.public.Enrollment.aggregate((a) => ({ total: a.count() })),
  ]);

  const stats = [
    { label: "Users", value: userCount.total, color: "bg-brand-blue text-white" },
    { label: "Courses", value: courseCount.total, color: "bg-brand-green" },
    { label: "Enrollments", value: enrollmentCount.total, color: "bg-brand-yellow" },
  ];

  return (
    <>
      <Sticker className="bg-brand-yellow">Admin</Sticker>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
        Platform overview
      </h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <NeoCard key={s.label} className={cn("p-6", s.color)}>
            <p className="text-sm font-medium">{s.label}</p>
            <p className="mt-2 font-display text-5xl font-extrabold">{s.value}</p>
          </NeoCard>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl font-extrabold">All users</h2>
      <p className="mt-1 text-sm">
        Change a role with the dropdown. The user has to log in again for the
        new role to take effect.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border-2 border-ink bg-white shadow-hard">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b-2 border-ink bg-brand-lilac">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-ink/20 last:border-b-0">
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3 font-medium">
                  {u.name}
                  {u.id === session.userId && (
                    <span className="ml-2 text-xs font-normal">(you)</span>
                  )}
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <RoleSelect
                    userId={u.id}
                    current={u.role}
                    disabled={u.id === session.userId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Suspense fallback={<p className="text-sm font-medium">Loading...</p>}>
        <AdminContent />
      </Suspense>
    </main>
  );
}