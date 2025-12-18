const express = require('express');
const router = express.Router();

// Ця функція приймає контролер і налаштовує шляхи
module.exports = (controller) => {
    router.get('/', controller.getAll);
    router.post('/', controller.create);
    router.get('/:id', controller.getOne);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    return router;
};