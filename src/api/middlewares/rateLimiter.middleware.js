const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 100, // Максимум 100 запитів з однієї IP за вікно
    standardHeaders: true, // Повертає заголовки RateLimit-*
    legacyHeaders: false, // Відключає старі заголовки X-RateLimit-*
    message: {
        error: {
            code: 429,
            message: "Too many requests, please try again later."
        }
    }
    // express-rate-limit автоматично додає заголовок Retry-After при досягненні ліміту
});

module.exports = limiter;