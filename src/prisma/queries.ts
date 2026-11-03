import { db } from "./db";

async function main() {
  // Query 1: shob user
  const users = await db.orm.public.User.all();
  console.log("1. Total users:", users.length);

  // Query 2: ekjon user, email diye
  const rima = await db.orm.public.User.where({
    email: "rima@lms.test",
  }).first();
  console.log("2. Found:", rima ? rima.name : "not found");

  // Query 3: published course, shudhu id ar title
  const published = await db.orm.public.Course.where({ published: true })
    .select("id", "title")
    .all();
  console.log("3. Published courses:", published);

  const coursesWithInstructor =
    await db.orm.public.Course.include("instructor").all();
  for (const course of coursesWithInstructor) {
    console.log(`4. ${course.title} - ${course.instructor.name}`);
  }

  const instructors = await db.orm.public.User.where({ role: "INSTRUCTOR" })
    .select("id", "name")
    .include("courses")
    .all();
  for (const instructor of instructors) {
    console.log(instructor.name, "has", instructor.courses.length, "courses");
  }

  const reactCourses = await db.orm.public.Course.where((c) =>
    c.title.ilike("%react%"),
  ).all();
  console.log("5. React courses:", reactCourses.length);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
