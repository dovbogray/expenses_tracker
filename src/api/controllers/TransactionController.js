class TransactionController {
    constructor(transactionService) {
        this.service = transactionService;
    }

    // GET /expenses
    getAll = async (req, res) => {
        try {
            const data = await this.service.getAllTransactions();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: { code: 500, message: error.message } });
        }
    }

    // GET /expenses/:id
    getOne = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const transaction = await this.service.getTransactionById(id);

            if (!transaction) {
                return res.status(404).json({ 
                    error: { code: 404, message: `Transaction with ID ${id} not found` } 
                });
            }
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ error: { code: 500, message: error.message } });
        }
    }

    // POST /expenses
    create = async (req, res) => {
        try {
            const result = await this.service.createTransaction(req.body);
            res.status(201).json(result);
        } catch (error) {
            // Якщо помилка валідації (наприклад, сума 0), повертаємо 400
            res.status(400).json({ 
                error: { code: 400, message: error.message } 
            });
        }
    }

    // PUT /expenses/:id
    update = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const updated = await this.service.updateTransaction(id, req.body);

            if (!updated) {
                return res.status(404).json({ 
                    error: { code: 404, message: `Transaction with ID ${id} not found` } 
                });
            }
            res.json(updated);
        } catch (error) {
            res.status(400).json({ 
                error: { code: 400, message: error.message } 
            });
        }
    }

    // DELETE /expenses/:id
    delete = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const success = await this.service.deleteTransaction(id);

            if (!success) {
                return res.status(404).json({ 
                    error: { code: 404, message: `Transaction with ID ${id} not found` } 
                });
            }
            // 204 No Content - успішно видалено, без тіла відповіді
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: { code: 500, message: error.message } });
        }
    }
}

module.exports = TransactionController;