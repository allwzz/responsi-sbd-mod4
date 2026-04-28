require("dotenv").config({ path: ".env.local" });
const { neon } = require("@neondatabase/serverless");

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);

  console.log("Running migrations...");

  await sql`
    CREATE TABLE IF NOT EXISTS members (
      member_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name   VARCHAR(100) NOT NULL,
      email       VARCHAR(100) UNIQUE NOT NULL,
      member_type VARCHAR(20) NOT NULL CHECK (member_type IN ('STUDENT', 'LECTURER', 'STAFF')),
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS books (
      book_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title      VARCHAR(200) NOT NULL,
      author     VARCHAR(100) NOT NULL,
      isbn       VARCHAR(20) UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS loans (
      loan_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      member_id  UUID NOT NULL REFERENCES members(member_id),
      book_id    UUID NOT NULL REFERENCES books(book_id),
      loan_date  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      return_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  console.log("Migrations completed.");
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
