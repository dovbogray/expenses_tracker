const Transaction = require('../../domain/accounting/Transaction');

class TransactionService {
    constructor(transactionRepository) {
        this.repo = transactionRepository;
    }

    async createTransaction(dto) {
        // Створюємо сутність (тут спрацює валідація: сума != 0, опис > 3 символів)
        // id = null, бо це новий запис
        const transaction = new Transaction(
            null, 
            dto.amount, 
            dto.description, 
            1, // categoryId (поки хардкод)
            1, // userId (поки хардкод)
            dto.date
        );

        const newId = await this.repo.save(transaction);
        
        // Повертаємо створений об'єкт вже з ID
        transaction.id = newId;
        return transaction;
    }

    async getAllTransactions() {
        return await this.repo.findAll();
    }

    async getTransactionById(id) {
        return await this.repo.findById(id);
    }

    async updateTransaction(id, dto) {
        // Спочатку перевіряємо, чи існує запис
        const existing = await this.repo.findById(id);
        if (!existing) return null;

        // Створюємо нову версію сутності (валідація знову спрацює)
        const updatedTransaction = new Transaction(
            id,
            dto.amount,
            dto.description,
            1, 
            1,
            dto.date
        );

        const success = await this.repo.update(updatedTransaction);
        return success ? updatedTransaction : null;
    }

    async deleteTransaction(id) {
        return await this.repo.delete(id);
    }
}

module.exports = TransactionService;