 const sqlite3 = require('sqlite3');
 const { open } = require('sqlite');

 async function initDB(){
    //Підключення до БД
    const db = await open({
        filename: './tracker.sqlite',
        driver: sqlite3.Database
    });
    // Створення таблиці
    await db.exec(`
        CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        description TEXT NOT NULL ,
        amount REAL NOT NULL,
        date TEXT NOT NULL
        )    
    `)

    return db;
 }

 module.exports = initDB;