import mysql from "mysql2/promise";
import fs from "node:fs/promises";
import path from "node:path";

// CẤU HÌNH KẾT NỐI - HÃY THAY ĐỔI THEO THÔNG TIN CỦA BẠN
const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "", // <--- ĐIỀN MẬT KHẨU MYSQL CỦA BẠN VÀO ĐÂY
  database: "gofarm_db" // <--- ĐIỀN TÊN DATABASE CỦA BẠN VÀO ĐÂY
};

const JSON_DATA_PATH = path.resolve(process.cwd(), "data", "gofarm-backend-db.json");

async function migrate() {
  let connection;
  try {
    console.log("正在连接到 MySQL...");
    // Kết nối lần đầu không chọn database để đảm bảo database tồn tại
    const tempConn = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\`;`);
    await tempConn.end();

    // Kết nối chính thức
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("Đã kết nối thành công tới MySQL.");

    // 1. Tạo bảng nếu chưa có
    console.log("Đang khởi tạo cấu trúc bảng...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        imageSrc TEXT,
        count INT DEFAULT 0,
        createdAt DATETIME,
        updatedAt DATETIME
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        imageSrc TEXT NOT NULL,
        imageAlt VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        discount INT,
        brand VARCHAR(255),
        categoryId VARCHAR(255),
        categoryTitle VARCHAR(255),
        description TEXT,
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews INT DEFAULT 0,
        stock INT,
        status VARCHAR(50),
        createdAt DATETIME,
        updatedAt DATETIME,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        createdAt DATETIME,
        updatedAt DATETIME,
        resetTokenHash TEXT,
        resetTokenExpiresAt DATETIME
      )
    `);

    // 2. XÓA TOÀN BỘ DỮ LIỆU CŨ
    console.log("Đang xóa dữ liệu cũ...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
    await connection.query("TRUNCATE TABLE products;");
    await connection.query("TRUNCATE TABLE categories;");
    await connection.query("TRUNCATE TABLE users;");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1;");

    // 3. ĐỌC DỮ LIỆU TỪ JSON
    console.log("Đang đọc dữ liệu từ JSON...");
    const rawData = await fs.readFile(JSON_DATA_PATH, "utf8");
    const data = JSON.parse(rawData);

    // 4. ĐẨY DỮ LIỆU VÀO MYSQL
    console.log(`Đang nạp ${data.categories.length} danh mục...`);
    const usedCategorySlugs = new Set();
    for (const cat of data.categories) {
      let slug = cat.slug;
      let suffix = 2;
      while (usedCategorySlugs.has(slug)) {
        slug = `${cat.slug}-${suffix++}`;
      }
      usedCategorySlugs.add(slug);

      await connection.query(
        "INSERT INTO categories (id, title, slug, imageSrc, count, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [cat.id, cat.title, slug, cat.imageSrc, cat.count, new Date(cat.createdAt), new Date(cat.updatedAt)]
      );
    }

    console.log(`Đang nạp ${data.products.length} sản phẩm...`);
    const usedProductSlugs = new Set();
    for (const p of data.products) {
      let slug = p.slug;
      let suffix = 2;
      while (usedProductSlugs.has(slug)) {
        slug = `${p.slug}-${suffix++}`;
      }
      usedProductSlugs.add(slug);

      await connection.query(
        "INSERT INTO products (id, name, slug, imageSrc, imageAlt, price, discount, brand, categoryId, categoryTitle, description, rating, reviews, stock, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          p.id, p.name, slug, p.imageSrc, p.imageAlt, p.price, p.discount, p.brand, 
          p.categoryId, p.categoryTitle, p.description, p.rating, p.reviews, p.stock, 
          p.status, new Date(p.createdAt), new Date(p.updatedAt)
        ]
      );
    }

    console.log(`Đang nạp ${data.users?.length || 0} người dùng...`);
    if (data.users) {
      for (const u of data.users) {
        await connection.query(
          "INSERT INTO users (id, name, email, passwordHash, role, createdAt, updatedAt, resetTokenHash, resetTokenExpiresAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            u.id, u.name, u.email, u.passwordHash, u.role, 
            new Date(u.createdAt), new Date(u.updatedAt), 
            u.resetTokenHash, u.resetTokenExpiresAt ? new Date(u.resetTokenExpiresAt) : null
          ]
        );
      }
    }

    console.log("--- HOÀN THÀNH DI CƯ DỮ LIỆU ---");
  } catch (error) {
    console.error("LỖI KHI DI CƯ DỮ LIỆU:", error);
  } finally {
    if (connection) await connection.end();
  }
}

migrate();
