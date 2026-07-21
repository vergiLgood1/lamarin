/**
 * Database deployment script.
 *
 * Reads pending migrations from the journal and applies them directly
 * using the unpooled Neon connection. Avoids drizzle-kit timeout issues
 * on Neon pooled connections.
 *
 * Usage: bun run db:deploy
 */
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

config({ path: ".env" });

const MIGRATIONS_DIR = join(__dirname, "..", "src", "db", "migrations");
const JOURNAL_PATH = join(MIGRATIONS_DIR, "meta", "_journal.json");

const DATABASE_URL =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL or DATABASE_URL_UNPOOLED is not set");
  process.exit(1);
}

async function main() {
  const sql = neon(DATABASE_URL);

  // Ensure drizzle schema and migrations table exist
  await sql`CREATE SCHEMA IF NOT EXISTS "drizzle"`;
  await sql`
    CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash TEXT NOT NULL,
      created_at BIGINT NOT NULL
    )
  `;

  // Read journal
  const journal = JSON.parse(readFileSync(JOURNAL_PATH, "utf-8"));
  const entries = journal.entries as {
    idx: number;
    version: string;
    when: number;
    tag: string;
    breakpoints: boolean;
  }[];

  // Get applied migrations from DB — store tag alongside hash for comparison
  const applied = await sql`
    SELECT hash, created_at FROM "drizzle"."__drizzle_migrations"
    ORDER BY id
  `;
  const appliedTags = new Set<string>();

  // Try to match by checking which tags have been applied
  // drizzle-kit stores hash in the table; we match by re-computing
  for (const entry of entries) {
    const hash = hashTag(entry.tag);
    if (applied.some((r: { hash: string }) => r.hash === hash)) {
      appliedTags.add(entry.tag);
    }
  }

  // Find pending migrations
  const pending = entries.filter((entry) => !appliedTags.has(entry.tag));

  if (pending.length === 0) {
    console.log("✓ Semua migration sudah terapply. Database up-to-date.");
    process.exit(0);
  }

  console.log(`\nMenemukan ${pending.length} pending migration:\n`);

  for (const entry of pending) {
    const sqlFile = join(MIGRATIONS_DIR, `${entry.tag}.sql`);

    if (!existsSync(sqlFile)) {
      console.error(`  ❌ File tidak ditemukan: ${entry.tag}.sql`);
      process.exit(1);
    }

    const sqlContent = readFileSync(sqlFile, "utf-8");
    const statements = sqlContent
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

    console.log(`  📦 ${entry.tag} (${statements.length} statements)...`);

    try {
      for (const statement of statements) {
        await sql.unsafe(statement);
      }

      // Record in migrations table
      const hash = hashTag(entry.tag);
      await sql`
        INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at)
        VALUES (${hash}, ${entry.when})
      `;

      console.log(`  ✅ ${entry.tag} berhasil`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`  ❌ ${entry.tag} gagal: ${message}`);
      console.error(
        "\n⚠️  Migration gagal. Database mungkin dalam state inkonsisten.",
      );
      console.error("   Perbaiki manual lalu jalankan ulang.\n");
      process.exit(1);
    }
  }

  const dbAfter = await sql`
    SELECT COUNT(*) as count FROM "drizzle"."__drizzle_migrations"
  `;
  console.log(
    `\n✓ Selesai! ${pending.length} migration berhasil diapply. Total: ${dbAfter[0].count} migrations.`,
  );
  process.exit(0);
}

function hashTag(tag: string): string {
  // Simple but deterministic hash for migration tags
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    const char = tag.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function existsSync(path: string): boolean {
  try {
    readFileSync(path);
    return true;
  } catch {
    return false;
  }
}

main();
