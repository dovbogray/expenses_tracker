const express = require('express');
const path = require('path');
const initDB = require('./db');
const timeout = require('connect-timeout'); 
require('dotenv').config();

// Імпорт Middleware
const requestId = require('../src/api/middlewares/requestId.middleware');
const rateLimiter = require('../src/api/middlewares/rateLimiter.middleware'); 
const idempotency = require('../src/api/middlewares/idempotency.middleware'); 

const TransactionRepository = require('../src/infrastructure/repositories/TransactionRepository');
const TransactionService = require('../src/application/services/TransactionService');
const TransactionController = require('../src/api/controllers/TransactionController');
const createExpenseRoutes = require('../src/api/routes/expenses.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// X-Request-Id
app.use(requestId);

// Timeout (Обрубуємо запит, якщо він триває довше 5 секунд)
app.use(timeout('5s'));

// Rate Limiter
app.use(rateLimiter);


app.use(express.json());
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

// Idempotency
app.use(idempotency);

// Middleware для обробки Timeout помилок (якщо 5 сек пройшло)
app.use((req, res, next) => {
    if (!req.timedout) next();
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
    try {
        const db = await initDB();
        
        const transactionRepo = new TransactionRepository(db);
        const transactionService = new TransactionService(transactionRepo);
        const transactionController = new TransactionController(transactionService);

        app.use('/expenses', createExpenseRoutes(transactionController));

        // Глобальний обробник помилок
        app.use((err, req, res, next) => {
        console.error(`[Error] Request ID: ${req.id}`, err.stack);

    //  Структура помилки
        const errorResponse = {
            error: err.message || "Internal Server Error", // Короткий опис
            code: res.statusCode >= 400 ? res.statusCode : 500, // Код помилки
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Деталі
            requestId: req.id // ID для кореляції (щоб знайти в логах)
    };

    // Обробка таймауту на сервері
    if (req.timedout) {
        errorResponse.error = "Service Unavailable: Request timed out";
        errorResponse.code = 503;
        return res.status(503).json(errorResponse);
    }

    // Відправка відповіді
    res.status(errorResponse.code).json(errorResponse);
});

        app.listen(PORT, () => {
            console.log(`🚀 Server started on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to start:', error);
    }
}

startServer();