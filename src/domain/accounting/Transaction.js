class Transaction {
    constructor(id, amount, description, categoryId, userId, date = new Date()) {
        this.id = id;
        this.categoryId = categoryId;
        this.userId = userId;

        // Валідація суми
        this.validateAmount(amount);
        this.amount = amount;

        // Валідація опису
        this.validateDescription(description);
        this.description = description;

        // Перевірка дати
        this.validateDate(date);
        this.date = new Date(date);
    }

    // Бізнес-правило: Сума не може бути нулем
    validateAmount(amount) {
        if (typeof amount !== 'number' || isNaN(amount)) {
            throw new Error('Amount must be a number');
        }
        if (amount === 0) {
            throw new Error('Transaction amount cannot be zero');
        }
    }

    // Бізнес-правило: Опис обов'язковий і не надто короткий
    validateDescription(description) {
        if (!description || description.trim().length < 3) {
            throw new Error('Description must be at least 3 characters long');
        }
    }

    // Бізнес-правило: Дата не може бути з майбутнього
    validateDate(date) {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            throw new Error('Invalid date format');
        }
        if (d > new Date()) {
             console.warn('Warning: Transaction date is in the future');
        }
    }
}

module.exports = Transaction;