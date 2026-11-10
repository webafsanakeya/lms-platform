# LMS Platform

A full-stack learning management system built with Next.js, TypeScript, Prisma 8 and PostgreSQL. It has secure authentication, role-based access (student, instructor, admin) and a relational course model.

**Live demo:** https://lms-platform-mu-ten.vercel.app

> Status: work in progress. Authentication, roles and the data model are done. Course and enrollment features are next.

<!-- Add two screenshots to a docs/ folder and uncomment:
![Login page](docs/login.png)
![Dashboard](docs/dashboard.png)
-->

## Features

- Register, log in and log out with bcrypt-hashed passwords
- Signed session cookie (JWT created with `jose`), `httpOnly`, and `secure` in production
- Three roles: `STUDENT`, `INSTRUCTOR`, `ADMIN`
- Access control is enforced twice: `proxy.ts` redirects pages by role, and every protected API route checks the role again on the server (401 when not logged in, 403 for the wrong role)
- Instructor endpoints are scoped to the logged-in instructor's own courses, using the user id inside the signed session
- Input validation with Zod on the server, and one generic error for wrong email or wrong password so accounts cannot be guessed
- Row Level Security enabled on every table through a Prisma migration
- Responsive UI built with Tailwind CSS and shadcn/ui, with a role-aware navbar

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React, TypeScript |
| Database | PostgreSQL on Supabase |
| ORM | Prisma 8 (release candidate) |
| Auth | bcryptjs, jose (JWT), httpOnly cookies |
| Validation | Zod |
| UI | Tailwind CSS 4, shadcn/ui |
| Hosting | Vercel |

## Data model

- **User**: name, unique email, password hash, role
- **Course**: title, unique slug, description, price in cents, published flag, belongs to one instructor
- **Enrollment**: links a user to a course, with a unique constraint on (user, course) so nobody enrolls twice

## API

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/register` | Public | Create a student account |
| POST | `/api/login` | Public | Log in and set the session cookie |
| POST | `/api/logout` | Any | Clear the session cookie |
| GET | `/api/me` | Logged in | Return the current user id and role |
| GET | `/api/admin/users` | Admin | List users (without password hashes) |
| GET | `/api/instructor/courses` | Instructor | List the instructor's own courses |

Pages: `/login`, `/register`, `/dashboard` (any logged-in user), `/instructor` (instructor or admin), `/admin` (admin only).

## Getting started

Requirements: Node.js 22.18 or newer (24 recommended) and a PostgreSQL database such as a free Supabase project.

```bash
git clone https://github.com/webafsanakeya/lms-platform.git
cd lms-platform
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Long random string used to sign sessions |
| `SEED_PASSWORD` | Password (12+ characters) for the demo accounts created by the seed script |

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Prepare the database and run the app:

```bash
npx prisma contract emit
npx prisma db migrate
npx tsx src/prisma/seed.ts   # warning: deletes all existing users, courses and enrollments
npm run dev
```

Open http://localhost:3000. The seed script creates `admin@lms.test`, `rima@lms.test` (instructor) and `karim@lms.test` (student) with the password you set in `SEED_PASSWORD`.

## Project structure

```
src/
  app/
    api/            # register, login, logout, me, admin, instructor routes
    login/ register/ dashboard/ instructor/ admin/
  components/       # navbar, logout button, shadcn/ui components
  lib/              # token, session, guards, validations
  prisma/           # contract.prisma, db client, seed and query scripts
  proxy.ts          # role-based page redirects
migrations/         # Prisma migration history
```

## Security notes

- Passwords are never stored in plain text and the hash is never returned by the API
- The role is always set on the server; a client cannot choose its own role at registration
- The session secret and database URL live in environment variables, not in the repository
- The proxy is only the first gate; protected API routes verify the session again before touching data

## Roadmap

- [ ] Course creation and editing for instructors
- [ ] Course catalog and enrollment for students
- [ ] Payments with Stripe (test mode)
- [ ] Automated tests and CI with GitHub Actions
- [ ] Docker setup and cloud deployment
- [ ] Rate limiting on the login endpoint

## What I learned

- Designing a relational schema with Prisma 8 contracts and planning and applying migrations
- The difference between authentication and authorization, and why both the proxy and the API routes need checks
- Keeping secrets out of version control and out of a public seed script
- Working through branches and pull requests, and deploying a Next.js app to Vercel with a Supabase database

## Author

Afsana Noor Keya · [Portfolio](https://keya-portfolio-chi.vercel.app) · [LinkedIn](https://www.linkedin.com/in/web-afsana-noor-keya-) · [GitHub](https://github.com/webafsanakeya)
