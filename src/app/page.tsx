import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Secure accounts",
    text: "Passwords are hashed and sessions use signed, httpOnly cookies.",
  },
  {
    title: "Role-based access",
    text: "Students, instructors and admins only see what they are allowed to.",
  },
  {
    title: "Modern stack",
    text: "Built with Next.js, TypeScript, Prisma and PostgreSQL.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Learn new skills, one course at a time
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          A full-stack learning platform with secure sign-in and role-based
          dashboards. Course features are coming soon.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/register" className={buttonVariants({ size: "lg" })}>
            Get started
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            Log in
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-24 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {f.text}
            </CardContent>
          </Card>
        ))}
      </section>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
  Built by Afsana Noor Keya ·{" "}
  <a href="https://github.com/webafsanakeya/lms-platform" className="underline">
    Source on GitHub
  </a>
</footer>
    </main>
    
  );
}