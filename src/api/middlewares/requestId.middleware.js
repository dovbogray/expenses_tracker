const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
    // Якщо клієнт вже надіслав ID (наприклад, для ретраю), беремо його.
    // Якщо ні — генеруємо новий.
    req.id = req.headers['x-request-id'] || uuidv4();
    
    // Обов'язково повертаємо цей ID у відповіді, щоб клієнт теж знав "номер талончика"
    res.setHeader('X-Request-Id', req.id);
    
    next();
};