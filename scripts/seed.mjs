import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local" });
dotenv.config();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: url });
  await client.connect();
  const sql = readFileSync(join(root, "db", "seed.sql"), "utf8");
  await client.query(sql);
  await client.end();
  console.log("seed complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
