const assert = require('assert');
const TransactionService = require('../../src/application/services/TransactionService');


// Цей клас замінює справжній TransactionRepository.
// Він потрібен, щоб тест не ліз у реальну базу даних SQLite.
class MockTransactionRepository {
    async save(transaction) {
        return 123; 
    }
}

async function runTests() {
    console.log('🧪 Запуск Unit-тестів для TransactionService...\n');

    // створюємо сервіс із фейковим репозиторієм
    const mockRepo = new MockTransactionRepository();
    const service = new TransactionService(mockRepo);

    // ТЕСТ 1: Успішний випадок (Happy Path)
    console.log('Test 1: Створення коректної транзакції...');
    
    const validDTO = {
        amount: 500,
        description: "Тестова покупка",
        date: new Date().toISOString()
    };

    try {
        const result = await service.createTransaction(validDTO);
        
        // Перевіряємо результати (Assertions)
        assert.strictEqual(result.id, 123, 'ID має бути 123 (від моку)');
        assert.strictEqual(result.amount, 500, 'Сума має зберігатися');
        assert.strictEqual(result.description, "Тестова покупка", 'Опис має співпадати');
        
        console.log('✅ PASSED\n');
    } catch (error) {
        console.error('❌ FAILED:', error);
        process.exit(1);
    }

    // ТЕСТ 2: Помилковий випадок (Validation Error)
    console.log('Test 2: Спроба створити транзакцію з сумою 0...');

    const invalidDTO = {
        amount: 0, // Невалідна сума 
        description: "Цей тест має впасти",
        date: new Date().toISOString()
    };

    try {
        await service.createTransaction(invalidDTO);
        throw new Error('Тест провалився: Сервіс пропустив нульову суму!');
    } catch (error) {
        if (error.message === 'Transaction amount cannot be zero') {
            console.log('✅ PASSED (Отримано очікувану помилку:', error.message, ')\n');
        } else if (error.message === 'Тест провалився: Сервіс пропустив нульову суму!') {
             console.error('❌ FAILED:', error.message);
             process.exit(1);
        } else {
            console.error('❌ FAILED WITH UNEXPECTED ERROR:', error);
            process.exit(1);
        }
    }
    
    console.log('🎉 Всі тести пройдено успішно!');
}

runTests();