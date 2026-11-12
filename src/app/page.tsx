import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Sticker, NeoCard } from "@/components/neo";
import { cn } from "@/lib/utils";

const perks = ["Secure sign-in", "Role-based dashboards", "Open source"];

const facts = [
  { value: "3", label: "user roles" },
  { value: "2", label: "layers of access checks" },
  { value: "CI", label: "lint, test and build on every PR" },
];

const steps = [
  {
    n: "1",
    title: "Create an account",
    text: "Register with your name, email and a password. Passwords are hashed before they are stored.",
    color: "bg-brand-blue text-white",
  },
  {
    n: "2",
    title: "Log in",
    text: "Your session is a signed cookie that JavaScript cannot read.",
    color: "bg-brand-green text-ink",
  },
  {
    n: "3",
    title: "Open your dashboard",
    text: "What you see depends on your role, and the server checks it again on every request.",
    color: "bg-brand-yellow text-ink",
  },
];

const roles = [
  {
    title: "Student",
    text: "Your dashboard shows how many courses you are enrolled in.",
    soon: "Course catalog and enrollment",
    color: "bg-brand-blue text-white",
  },
  {
    title: "Instructor",
    text: "A protected API returns only the courses that belong to you.",
    soon: "Create and edit courses",
    color: "bg-brand-green text-ink",
  },
  {
    title: "Admin",
    text: "An admin-only endpoint lists every user, without password hashes.",
    soon: "User management",
    color: "bg-brand-yellow text-ink",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <Sticker>Learn by doing</Sticker>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
            Learn skills that get you hired
          </h1>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded border-2 border-ink bg-brand-purple text-xs text-white">
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-lg border-2 border-ink bg-brand-blue text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
              )}
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-lg border-2 border-ink bg-white text-ink shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
              )}
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="relative hidden h-[420px] lg:block">
          <span
            aria-hidden
            className="absolute right-6 top-2 h-3 w-3 rotate-12 border-2 border-ink bg-brand-purple"
          />
          <span
            aria-hidden
            className="absolute bottom-8 left-6 h-4 w-4 -rotate-12 border-2 border-ink bg-brand-yellow"
          />

          <NeoCard className="absolute left-8 top-0 w-72 rotate-1 p-0">
            <div className="p-4 text-sm font-semibold">Today&apos;s course</div>
            <div className="rounded-b-2xl bg-brand-green p-4">
              <p className="font-display text-lg font-bold">React Basics</p>
              <p className="text-xs">Sample data</p>
              <div className="mt-3 h-2 rounded-full bg-white/60">
                <div className="h-2 w-4/5 rounded-full bg-ink" />
              </div>
            </div>
          </NeoCard>

          <NeoCard className="absolute left-0 top-44 w-64 -rotate-1">
            <p className="text-sm font-semibold">Performance</p>
            <svg viewBox="0 0 200 80" className="mt-3 h-20 w-full" aria-hidden>
              <polyline
                points="0,60 30,40 60,50 90,20 120,35 150,15 200,30"
                fill="none"
                stroke="#2f6bff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="0,70 40,55 80,65 120,45 160,55 200,40"
                fill="none"
                stroke="#ffe53b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-1 text-xs text-muted-foreground">Sample data</p>
          </NeoCard>

          <NeoCard className="absolute right-0 top-52 w-64 rotate-2">
            <p className="text-sm font-semibold">Scheduled</p>
            <div className="mt-3 space-y-2">
              <div className="rounded-lg border-2 border-ink bg-brand-purple px-3 py-2 text-sm font-semibold text-white">
                Intro to React
              </div>
              <div className="rounded-lg border-2 border-ink bg-brand-yellow px-3 py-2 text-sm font-semibold">
                Node.js APIs
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Sample data</p>
          </NeoCard>
        </div>
      </section>

      {/* Facts strip */}
      <section className="border-y-2 border-ink bg-brand-lilac">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-8">
          <div className="flex flex-wrap gap-10">
            {facts.map((f) => (
              <div key={f.label}>
                <p className="font-display text-4xl font-extrabold">{f.value}</p>
                <p className="max-w-[11rem] text-sm font-medium">{f.label}</p>
              </div>
            ))}
          </div>
          <a
            href="https://github.com/webafsanakeya/lms-platform"
            target="_blank"
            rel="noreferrer"
            className="inline-block -rotate-2 border-2 border-ink bg-brand-yellow px-4 py-2 font-hand text-2xl shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            See the code on GitHub →
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Sticker className="bg-brand-purple text-white">How it works</Sticker>
        <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Three steps, no setup
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <NeoCard key={s.n} className={cn("p-6", s.color)}>
              <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-white font-display text-lg font-extrabold text-ink">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm">{s.text}</p>
            </NeoCard>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="border-y-2 border-ink bg-brand-lilac">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Built for three roles
          </h2>
          <p className="mt-3 max-w-xl text-sm">
            Each role sees different pages and different data. What is still on
            the roadmap is marked clearly.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {roles.map((r) => (
              <NeoCard key={r.title} className={cn("p-6", r.color)}>
                <h3 className="font-display text-2xl font-extrabold">{r.title}</h3>
                <p className="mt-3 text-sm">{r.text}</p>
                <p className="mt-5 inline-block border-2 border-ink bg-white px-2 py-1 text-xs font-semibold text-ink">
                  Coming soon: {r.soon}
                </p>
              </NeoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-2xl border-2 border-ink bg-brand-purple p-10 text-center text-white shadow-hard-lg">
          <h2 className="font-display text-3xl font-extrabold sm:text-5xl">
            Ready to try it?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm">
            Create an account in a few seconds and look around.
          </p>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 rounded-lg border-2 border-ink bg-brand-yellow font-semibold text-ink shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
            )}
          >
            Get started free
          </Link>
        </div>
      </section>
    </main>
  );
}