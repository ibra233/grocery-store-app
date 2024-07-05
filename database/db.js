import * as SQLite from 'expo-sqlite';

const db =  SQLite.openDatabaseSync('grocery-store-stock.db');



export const createTables = async () => {
  await db.execAsync(
    `PRAGMA journal_mode = WAL;
     CREATE TABLE IF NOT EXISTS products (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       quantity INTEGER NOT NULL,
       barcode TEXT NOT NULL UNIQUE,
       price REAL NOT NULL
     );`
  );
};

export const insertProduct = async (name, quantity, barcode, price) => {
  await db.execAsync(`INSERT INTO products (name, quantity, barcode, price) VALUES ('${name}', '${quantity}', '${barcode}', '${price}')`);
};

export const getProducts = async () => {
  const allRows = await db.getAllAsync('SELECT * FROM products');
  return allRows;
};

export const getProduct = async (barcode) => {
  const row = await db.getFirstAsync(`SELECT * FROM products where barcode = '${barcode}'`);
  return row;
};
export const getProductById = async (id) => {
  const row = await db.getFirstAsync(`SELECT * FROM products where id = '${id}'`);
  return row;
};
export const updateProduct = async (id, quantity, price) => {
  await db.runAsync('UPDATE products SET quantity = ?, price = ? WHERE id = ?', [quantity, price, id]);
};

export const deleteProduct = async (id) => {
  await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
};

export default db;
