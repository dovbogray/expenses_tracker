const express = require('express');
const path = require('path');
const initDB = require('./db');
require('dotenv').config();

const TransactionRepository = require('../src/infrastructure/repositories/TransactionRepository');
const TransactionService = require('../src/application/services/TransactionService');
const TransactionController = require('../src/api/controllers/TransactionController');
const createExpenseRoutes = require('../src/api/routes/expenses.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Налаштування Express
app.use(express.json());

// Налаштування шляху до папки client (вона на рівень вище)
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
    try {
        const db = await initDB();
        console.log("✅ База даних підключена");

        
        const transactionRepo = new TransactionRepository(db);
        
        const transactionService = new TransactionService(transactionRepo);
        
        const transactionController = new TransactionController(transactionService);

        app.use('/expenses', createExpenseRoutes(transactionController));

        app.listen(PORT, () => {
            console.log(`🚀 Server started on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Не вдалося запустити сервер:', error);
        process.exit(1);
    }
}

// Запускаємо все
startServer();