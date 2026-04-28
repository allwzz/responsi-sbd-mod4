import { LoanModel } from '../models/loanModel.js';

export const LoanController = {
  async createLoan(req, res) {
    const { book_id, member_id, due_date } = req.body;
    try {
      const loan = await LoanModel.createLoan(book_id, member_id, due_date);
      res.status(201).json({
        message: 'Peminjaman berhasil dicatat!',
        data: loan
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getLoans(req, res) {
    try {
      const loans = await LoanModel.getAllLoans();
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getTopBorrowers(req, res) {
    try {
      const rows = await LoanModel.getTopBorrowers();
      const data = rows.map((row) => ({
        member_id: row.member_id,
        full_name: row.full_name,
        email: row.email,
        member_type: row.member_type,
        total_loans: row.total_loans,
        last_loan_date: row.last_loan_date,
        favorite_book: {
          title: row.favorite_book_title,
          times_borrowed: row.favorite_book_times
        }
      }));
      res.status(200).json({
        message: 'Top 3 peminjam buku berhasil diambil',
        data
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
