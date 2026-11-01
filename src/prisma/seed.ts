import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./db";

async function main() {
  // 1. Purono data muche dao (foreign key-er karone ulto order-e)
  await db.orm.public.Enrollment.where({}).deleteAll();
  await db.orm.public.Course.where({}).deleteAll();
  await db.orm.public.User.where({}).deleteAll();

  // 2. Demo password hash koro (eta shudhu test-er jonno)
  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 3. Users banao
  const admin = await db.orm.public.User.create({
    name: "Admin User",
    email: "admin@lms.test",
    passwordHash,
    role: "ADMIN",
  });

  const instructor = await db.orm.public.User.create({
    name: "Rima Instructor",
    email: "rima@lms.test",
    passwordHash,
    role: "INSTRUCTOR",
  });

  const student = await db.orm.public.User.create({
    name: "Karim Student",
    email: "karim@lms.test",
    passwordHash,
    role: "STUDENT",
  });

  // 4. Courses banao
  const course1 = await db.orm.public.Course.create({
    title: "React Basics",
    slug: "react-basics",
    description: "Learn React from scratch",
    priceCents: 0,
    published: true,
    instructorId: instructor.id,
  });

    const course2 = await db.orm.public.Course.create({
    title: "JavaScript Basics",
    slug: "javaScript-basics",
    description: "Learn JavaScript from scratch",
    priceCents: 0,
    published: true,
    instructorId: instructor.id,
  });

  // 5. Enrollment banao
  await db.orm.public.Enrollment.create({
    userId: student.id,
    courseId: course1.id
  });

  


  // 6. Check koro
  const users = await db.orm.public.User.all();
  const courses = await db.orm.public.Course.all();
  const enrollments = await db.orm.public.Enrollment.all();
  console.log("Users:", users.length);
  console.log("Courses:", courses.length);
  console.log("Enrollments:", enrollments.length);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});