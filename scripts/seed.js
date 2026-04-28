require("dotenv").config({ path: ".env.local" });
const { neon } = require("@neondatabase/serverless");

async function seed() {
  const sql = neon(process.env.DATABASE_URL);

  console.log("Seeding database...");

  // Clear existing data
  await sql`TRUNCATE TABLE loans, books, members RESTART IDENTITY CASCADE`;

  // Members
  await sql`
    INSERT INTO members (member_id, full_name, email, member_type) VALUES
      ('d4000000-0000-0000-0000-000000000001', 'Allwan Setyo Raharjo',                  'allwan.setyo@students.undip.ac.id',   'STUDENT'),
      ('d4000000-0000-0000-0000-000000000002', 'Mohammad Ikliel Hubban Ifthor Mubarok', 'ikliel.hubban@students.undip.ac.id',  'STUDENT'),
      ('d4000000-0000-0000-0000-000000000003', 'Mark Eleven Dexeleo',                   'mark.eleven@students.undip.ac.id',    'STUDENT')
  `;

  // Books (10 buku sastra Indonesia)
  await sql`
    INSERT INTO books (book_id, title, author, isbn) VALUES
      ('b1000000-0000-0000-0000-000000000001', 'Cantik Itu Luka',                  'Eka Kurniawan',                        '978-602-03-1235-5'),
      ('b1000000-0000-0000-0000-000000000002', 'Laut Bercerita',                   'Leila S. Chudori',                     '978-602-291-477-6'),
      ('b1000000-0000-0000-0000-000000000003', 'Bumi Manusia',                     'Pramoedya Ananta Toer',                '978-979-407-882-3'),
      ('b1000000-0000-0000-0000-000000000004', 'Saman',                            'Ayu Utami',                            '978-979-022-000-9'),
      ('b1000000-0000-0000-0000-000000000005', 'Ronggeng Dukuh Paruk',             'Ahmad Tohari',                         '978-979-22-7680-8'),
      ('b1000000-0000-0000-0000-000000000006', 'Entrok',                           'Okky Madasari',                        '978-602-03-1320-8'),
      ('b1000000-0000-0000-0000-000000000007', 'Sumur',                            'Eka Kurniawan',                        '978-602-06-4391-2'),
      ('b1000000-0000-0000-0000-000000000008', 'Laskar Pelangi',                   'Andrea Hirata',                        '978-979-1261-47-1'),
      ('b1000000-0000-0000-0000-000000000009', 'Tenggelamnya Kapal Van Der Wijck', 'Abdul Malik Karim Amrullah (Buya Hamka)', '978-979-17-0313-5'),
      ('b1000000-0000-0000-0000-000000000010', 'Perjalanan Menuju Pulang',         'Lala Bohang, Lala Noberg',             '978-602-06-5512-0')
  `;

  // Loans
  // Allwan  : 6 pinjaman — Laskar Pelangi x3 (fav), Cantik Itu Luka x2, Bumi Manusia x1
  // Mohammad: 5 pinjaman — Laut Bercerita x3 (fav), Saman x1, Ronggeng Dukuh Paruk x1
  // Mark    : 4 pinjaman — Bumi Manusia x2 (fav), Entrok x1, Sumur x1
  await sql`
    INSERT INTO loans (member_id, book_id, loan_date) VALUES
      -- Allwan Setyo Raharjo (6 pinjaman) — jam dalam WIB disimpan sebagai UTC (WIB - 7j)
      ('d4000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000008', '2026-02-03T02:15:00Z'),
      ('d4000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000008', '2026-02-24T03:45:00Z'),
      ('d4000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', '2026-03-10T01:30:00Z'),
      ('d4000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', '2026-03-28T06:20:00Z'),
      ('d4000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', '2026-04-07T04:50:00Z'),
      ('d4000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000008', '2026-04-09T02:10:00Z'),

      -- Mohammad Ikliel Hubban Ifthor Mubarok (5 pinjaman)
      ('d4000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', '2026-02-10T05:35:00Z'),
      ('d4000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', '2026-03-01T03:20:00Z'),
      ('d4000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', '2026-03-18T06:45:00Z'),
      ('d4000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000005', '2026-03-30T01:55:00Z'),
      ('d4000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', '2026-04-04T04:30:00Z'),

      -- Mark Eleven Dexeleo (4 pinjaman)
      ('d4000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', '2026-02-20T02:40:00Z'),
      ('d4000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000006', '2026-03-12T05:15:00Z'),
      ('d4000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', '2026-03-25T03:00:00Z'),
      ('d4000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000007', '2026-04-01T06:25:00Z')
  `;

  console.log("Seeding completed.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
