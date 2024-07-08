import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import XLSX from 'xlsx';

const db = SQLite.openDatabaseSync('grocery-store-stock.db');

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
export const insertProduct = async (name, quantity, barcode, price, isQuickItem) => {
  await db.execAsync(`INSERT INTO products (name, quantity, barcode, price, isQuickItem) VALUES ('${name}', '${quantity}', '${barcode}', '${price}', '${isQuickItem}')`);
};

// Ürün ekleme
export const insertImportProduct = async (name, quantity, barcode, price, isQuickItem) => {
  try {
    await db.execAsync(`INSERT INTO products (name, quantity, barcode, price, isQuickItem) VALUES ('${name}', '${quantity}', '${barcode}', '${price}', '${isQuickItem}')`);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed: products.barcode')) {
      await updateProductByBarcode(name, quantity, barcode, price, isQuickItem);
    } else {
      throw error;
    }
  }
};

// Barkoda göre ürün güncelleme
export const updateProductByBarcode = async (name, quantity, barcode, price, isQuickItem) => {
  await db.runAsync('UPDATE products SET name = ?, quantity = ?, price = ?, isQuickItem = ? WHERE barcode = ?', [name, quantity, price, isQuickItem, barcode]);
};

// Hızlı ürünleri getirme
export const getQuickItems = async () => {
  const quickItems = await db.getAllAsync('SELECT * FROM products WHERE isQuickItem = 1');
  return quickItems;
};

// Tüm ürünleri getirme
export const getProducts = async () => {
  const allRows = await db.getAllAsync('SELECT * FROM products');
  return allRows;
};

// Barkod ile ürün getirme
export const getProduct = async (barcode) => {
  const row = await db.getFirstAsync(`SELECT * FROM products WHERE barcode = '${barcode}'`);
  return row;
};

// ID ile ürün getirme
export const getProductById = async (id) => {
  const row = await db.getFirstAsync(`SELECT * FROM products WHERE id = '${id}'`);
  return row;
};

export const updateProduct = async (id, name, quantity, barcode, price, isQuickItem) => {
  await db.runAsync('UPDATE products SET name = ?, quantity = ?, barcode = ?, price = ?, isQuickItem = ? WHERE id = ?', [name, quantity, barcode, price, isQuickItem, id]);
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

// Veritabanını Excel'den içe aktarma
export const importDatabaseFromExcel = async (uri) => {
  const fileContent = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const workbook = XLSX.read(fileContent, { type: 'base64' });
  const productsSheet = workbook.Sheets['Products'];
  const products = XLSX.utils.sheet_to_json(productsSheet);

  for (let product of products) {
    await insertImportProduct(product.name, product.quantity, product.barcode, product.price, product.isQuickItem);
  }
};

// Veritabanını Excel'e dışa aktarma ve paylaşma
export const exportDatabaseToExcel = async () => {
  const products = await getProducts();
  const ws = XLSX.utils.json_to_sheet(products);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');

  const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  const uri = `${FileSystem.documentDirectory}products.xlsx`;

  await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  } else {
    alert('Paylaşma özelliği desteklenmiyor.');
  }
};

export default db;
