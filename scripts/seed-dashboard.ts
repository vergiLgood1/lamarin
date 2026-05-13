import { drizzle } from "drizzle-orm/postgres-js";
import { desc, eq } from "drizzle-orm";
import postgres from "postgres";
import { jobApplications, user } from "../src/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const jobTypes = [
  "fulltime",
  "parttime",
  "internship",
  "freelance",
  "contract",
  "temporary",
  "other",
] as const;

const statuses = [
  "applied",
  "reviewed",
  "interview",
  "test",
  "offered",
  "accepted",
  "rejected",
] as const;

const workModes = ["onsite", "hybrid", "remote"] as const;

const sources = [
  "LinkedIn",
  "Kalibrr",
  "Glints",
  "Company Website",
  "Jobstreet",
  "Referral",
];

const positions = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Product Designer",
  "Data Analyst",
  "Software QA",
  "DevOps Engineer",
  "Mobile Developer",
];

const companies = [
  "Nusa Digital",
  "Orbit Labs",
  "Skyline Tech",
  "Arah Data",
  "Pilar Produk",
  "Langit Nusantara",
  "Nexa AI",
  "Sagara Systems",
];

function randomFrom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

function toDateString(date: Date): string {
  return date.toISOString().split("T")[0] ?? "";
}

async function seedDashboard() {
  const sql = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  try {
    let [targetUser] = await db.select().from(user).orderBy(desc(user.createdAt)).limit(1);

    if (!targetUser) {
      const demoUserId = "seed-demo-user";
      [targetUser] = await db
        .insert(user)
        .values({
          id: demoUserId,
          name: "Demo User",
          email: "demo@applyorbit.local",
          emailVerified: true,
          image: null,
        })
        .returning();
    }

    await db.delete(jobApplications).where(eq(jobApplications.userId, targetUser.id));

    const now = new Date();
    const rows = Array.from({ length: 48 }).map((_, index) => {
      const monthOffset = Math.floor(index / 8);
      const baseDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      const applyDate = new Date(baseDate);
      applyDate.setDate(1 + (index % 24));

      const followUpDate = new Date(applyDate);
      followUpDate.setDate(applyDate.getDate() + 4 + (index % 8));

      return {
        userId: targetUser.id,
        applicationDate: toDateString(applyDate),
        companyName: randomFrom(companies),
        companyLocation: randomFrom(["Jakarta", "Bandung", "Surabaya", "Singapore"]),
        workMode: randomFrom(workModes),
        position: randomFrom(positions),
        jobSource: randomFrom(sources),
        jobType: randomFrom(jobTypes),
        followUpDate: toDateString(followUpDate),
        status: randomFrom(statuses),
        hrContact: "talent@company.test",
        salary: "Competitive",
        notes: "Generated seed data for dashboard analytics",
        meetingLink: null,
      };
    });

    await db.insert(jobApplications).values(rows);

    console.log(`Seed complete for user: ${targetUser.email}`);
    console.log(`Inserted ${rows.length} job applications.`);
  } finally {
    await sql.end();
  }
}

seedDashboard().catch((error) => {
  console.error(error);
  process.exit(1);
});
