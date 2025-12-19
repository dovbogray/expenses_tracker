const idempotencyCache = new Map(); // Тимчасове сховище: Key -> Response

module.exports = (req, res, next) => {
    // Ідемпотентність потрібна лише для методів, що змінюють дані (POST, PATCH)
    if (req.method !== 'POST') {
        return next();
    }

    const key = req.headers['idempotency-key'];

    if (!key) {
        return next();
    }

    // Перевіряємо, чи ми вже бачили цей ключ
    if (idempotencyCache.has(key)) {
        console.log(`♻️ Idempotency hit: ${key}`);
        const cachedResponse = idempotencyCache.get(key);
        
        // Повертаємо збережений результат
        res.setHeader('X-Cache', 'HIT');
        return res.status(cachedResponse.status).json(cachedResponse.body);
    }

    // Якщо це новий ключ, ми маємо перехопити відправку відповіді, щоб зберегти її
    const originalJson = res.json;
    
    res.json = function (body) {
        // Зберігаємо відповідь у кеш тільки якщо це був успіх (2xx) або помилка клієнта (4xx)
        if (res.statusCode < 500) {
            idempotencyCache.set(key, {
                status: res.statusCode,
                body: body
            });
            console.log(`💾 Saved idempotency key: ${key}`);
        }
        
        // Викликаємо оригінальний метод, щоб відправити відповідь клієнту
        originalJson.call(this, body);
    };

    next();
};