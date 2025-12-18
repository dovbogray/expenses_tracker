const express = require('express');
require('dotenv').config();
const initDB = require('./db');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.static('client'));

let db;

// Ініціалізація БД перед початком роботи
initDB().then((database) => {
    db = database;
    console.log("База даних підключена")
})


app.get('/expenses', async (req, res) => {
    try {
        const expenses = await db.all('SELECT * FROM expenses');
        res.json(expenses)

    } catch (error) {
        res.status(500).json({error: error.message});
    }  
})

app.post('/expenses', async (req, res) => {
  try {
    const { description, amount, date } = req.body;

    // Валідація: перевіряємо, чи прийшли дані
    if (!description || !amount) {
      return res.status(400).json({ error: 'Поле description та amount обов’язкові' });
    }

    // Якщо дата не прийшла, беремо поточну
    const expenseDate = date || new Date().toISOString();

    // Виконуємо вставку. result міститиме lastID
    const result = await db.run(
      'INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)',
      [description, amount, expenseDate]
    );

    // Повертаємо створений об'єкт
    res.status(201).json({
      id: result.lastID,
      description,
      amount,
      date: expenseDate
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`server start on http://localhost:${PORT}`);
})