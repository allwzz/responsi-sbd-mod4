import { getDb } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const sql = getDb();

    const rows = await sql`
      WITH loan_counts AS (
        SELECT
          l.member_id,
          COUNT(*)::int AS total_loans,
          MAX(l.loan_date) AS last_loan_date
        FROM loans l
        GROUP BY l.member_id
        ORDER BY total_loans DESC
        LIMIT 3
      ),
      favorite_books AS (
        SELECT DISTINCT ON (l.member_id)
          l.member_id,
          b.title,
          COUNT(*)::int AS times_borrowed
        FROM loans l
        JOIN books b ON b.book_id = l.book_id
        WHERE l.member_id IN (SELECT member_id FROM loan_counts)
        GROUP BY l.member_id, b.title
        ORDER BY l.member_id, times_borrowed DESC
      )
      SELECT
        m.member_id,
        m.full_name,
        m.email,
        m.member_type,
        lc.total_loans,
        lc.last_loan_date,
        fb.title  AS favorite_book_title,
        fb.times_borrowed AS favorite_book_times
      FROM loan_counts lc
      JOIN members m ON m.member_id = lc.member_id
      JOIN favorite_books fb ON fb.member_id = lc.member_id
      ORDER BY lc.total_loans DESC
    `;

    const data = rows.map((row) => ({
      member_id: row.member_id,
      full_name: row.full_name,
      email: row.email,
      member_type: row.member_type,
      total_loans: row.total_loans,
      last_loan_date: row.last_loan_date,
      favorite_book: {
        title: row.favorite_book_title,
        times_borrowed: row.favorite_book_times,
      },
    }));

    return res.status(200).json({
      message: "Top 3 peminjam buku berhasil diambil",
      data,
    });
  } catch (error) {
    console.error("Error fetching top borrowers:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
