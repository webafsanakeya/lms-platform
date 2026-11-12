import Link from "next/link";

const columns = [
  {
    title: "Project",
    links: [
      { label: "Home", href: "/" },
      { label: "Log in", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Links",
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/webafsanakeya/lms-platform",
      },
      {
        label: "Portfolio",
        href: "https://keya-portfolio-chi.vercel.app",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/web-afsana-noor-keya-",
      },
    ],
  },
];

const stack = ["Next.js", "TypeScript", "Prisma 8", "PostgreSQL", "Tailwind CSS"];

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-brand-lilac">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-extrabold">LMS</p>
          <p className="mt-2 text-sm">
            A full-stack learning platform built as a portfolio project.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 inline-block border-2 border-ink bg-brand-green px-2 text-sm font-semibold">
              {col.title}
            </p>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("/") ? (
                    <Link href={l.href} className="hover:underline">
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="mb-3 inline-block border-2 border-ink bg-brand-yellow px-2 text-sm font-semibold">
            Stack
          </p>
          <ul className="space-y-2 text-sm">
            {stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-ink py-4 text-center text-xs">
        Built by Afsana Noor Keya
      </div>
    </footer>
  );
}