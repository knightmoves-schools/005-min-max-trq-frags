const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const assert = require('assert');

function runScript(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getAllPricesFromGrocery(db) {
  const sql = `SELECT PRICE FROM Grocery`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

describe('the SQL in the `highest-exercise.sql` and `lowest-exercise.sql` file', () => {
  let db;
  let scriptPathHigh;
  let scriptPathLow;
  let highestPrice = 0;
  let lowestPrice = 10000;

  beforeAll( async () => {
    const dbPath = path.resolve(__dirname, '..', 'lesson5.db');
    db = new sqlite3.Database(dbPath);

    scriptPathHigh = path.resolve(__dirname, '..', 'highest-exercise.sql');
    scriptPathLow = path.resolve(__dirname, '..', 'lowest-exercise.sql');

    const prices = await getAllPricesFromGrocery(db);
    prices.forEach((price) => {
      if(price.PRICE > highestPrice)
        highestPrice = price.PRICE;
      if(price.PRICE < lowestPrice)
        lowestPrice = price.PRICE;
    });
  });

  afterAll(() => {
    db.close();
  });

  it('should return the largest `price` within the `Grocery` table', async () => {
      const results = await runScript(db, scriptPathHigh);
      console.log(results);

      expect(results.length).toBe(1);

      const key = Object.getOwnPropertyNames(results[0])[0];
      expect(results[0][key]).toBe(highestPrice);
  });

  it('should return the lowest `price` within the `Grocery` table', async () => {
      const results = await runScript(db, scriptPathLow);
      console.log(results);

      expect(results.length).toBe(1);

      const key = Object.getOwnPropertyNames(results[0])[0];
      expect(results[0][key]).toBe(lowestPrice);
  });
});


