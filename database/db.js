import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
const db =  SQLite.openDatabaseSync('grocery-store-stock.db');
import * as Sharing from 'expo-sharing';

// Tabloları oluşturma
export const createTables = async () => {
  await db.execAsync(
    `PRAGMA journal_mode = WAL;
     CREATE TABLE IF NOT EXISTS products (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       quantity INTEGER NOT NULL,
       barcode TEXT NOT NULL UNIQUE,
       price REAL NOT NULL,
       isQuickItem INTEGER
     );`
  );
};

// Ürün ekleme
export const insertProduct = async (name, quantity, barcode, price) => {
  await db.execAsync(`INSERT INTO products (name, quantity, barcode, price) VALUES ('${name}', '${quantity}', '${barcode}', '${price}')`);
};

// Tüm ürünleri getirme
export const getProducts = async () => {
  const allRows = await db.getAllAsync('SELECT * FROM products');
  return allRows;
};

// Barkod ile ürün getirme
export const getProduct = async (barcode) => {
  const row = await db.getFirstAsync(`SELECT * FROM products where barcode = '${barcode}'`);
  return row;
};

// ID ile ürün getirme
export const getProductById = async (id) => {
  const row = await db.getFirstAsync(`SELECT * FROM products where id = '${id}'`);
  return row;
};

// Ürün güncelleme
export const updateProduct = async (id, quantity, price) => {
  await db.runAsync('UPDATE products SET quantity = ?, price = ? WHERE id = ?', [quantity, price, id]);
};

// Ürün silme
export const deleteProduct = async (id) => {
  await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
};

// Veritabanını silme
export const deleteDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/grocery-store-stock.db`;
  await FileSystem.deleteAsync(dbPath);
};

// Veritabanını içe aktarma
export const importDatabase = async (uri) => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/grocery-store-stock.db`;
  await FileSystem.copyAsync({
    from: uri,
    to: dbPath,
  });
};

export const exportDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/grocery-store-stock.db`;
  const destPath = `${FileSystem.documentDirectory}SQLite/backup_${Date.now()}.db`;

  await FileSystem.copyAsync({
    from: dbPath,
    to: destPath,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(destPath);
  } else {
    Alert.alert('Paylaşma özelliği desteklenmiyor.');
  }
};

export default db;
