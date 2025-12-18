const Transaction = require('../../domain/accounting/Transaction');

class TransactionRepository {
    constructor(db) {
        this.db = db;
    }

    // 1. ЗБЕРЕГТИ (Create)
    async save(transaction) {
        const { amount, description, date, categoryId, userId } = transaction;
        const sql = `
            INSERT INTO expenses (description, amount, date)
            VALUES (?, ?, ?)
        `;
        const result = await this.db.run(sql, [description, amount, date.toISOString()]);
        return result.lastID;
    }

    // 2. ЗНАЙТИ ВСІ (Read All)
    async findAll() {
        const sql = `SELECT * FROM expenses`;
        const rows = await this.db.all(sql);
        return rows.map(this._mapRowToEntity);
    }

    // 3. ЗНАЙТИ ОДНУ ПО ID (Read One)
    async findById(id) {
        const sql = `SELECT * FROM expenses WHERE id = ?`;
        const row = await this.db.get(sql, [id]);
        
        if (!row) return null;
        return this._mapRowToEntity(row);
    }

    // 4. ОНОВИТИ (Update)
    async update(transaction) {
        const { id, amount, description, date } = transaction;
        const sql = `
            UPDATE expenses 
            SET description = ?, amount = ?, date = ?
            WHERE id = ?
        `;
        const result = await this.db.run(sql, [description, amount, date.toISOString(), id]);
        // result.changes показує, скільки рядків було змінено (0 або 1)
        return result.changes > 0;
    }

    // 5. ВИДАЛИТИ (Delete)
    async delete(id) {
        const sql = `DELETE FROM expenses WHERE id = ?`;
        const result = await this.db.run(sql, [id]);
        return result.changes > 0;
    }

    // Допоміжний метод: перетворює рядок з БД на клас Transaction
    _mapRowToEntity(row) {
        return new Transaction(
            row.id,
            row.amount,
            row.description,
            1, // categoryId (заглушка)
            1, // userId (заглушка)
            row.date
        );
    }
}

module.exports = TransactionRepository;