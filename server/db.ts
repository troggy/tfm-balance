
import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS balances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      balance REAL
    )
  `);
});

export function saveBalance(timestamp: string, balance: number): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO balances (timestamp, balance) VALUES (?, ?)',
      [timestamp, balance],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

export function getBalances(): Promise<Balance[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM balances ORDER BY timestamp', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

