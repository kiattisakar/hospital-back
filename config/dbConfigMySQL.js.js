// config / dbConfigMySQL.js;

module.exports = {
  host: "192.168.0.218", // หรือที่อยู่ IP ของเซิร์ฟเวอร์ MySQL
  user: "staff@pharmacy",
  password: "pharmacyKkh2018",
  database: "app_pharmacy", // ระบุชื่อฐานข้อมูลที่ต้องการใช้
  port: 3306, // หรือพอร์ตที่คุณต้องการใช้
  waitForConnections: true,
  connectionLimit: 10, // กำหนดจำนวน connection สูงสุดที่ต้องการ
  queueLimit: 0,
};

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "192.168.0.218",
//   user: "staff@pharmacy",
//   password: "192.168.0.218",
//   database: "app_pharmacy",
//   port: 3306,
//   waitForConnections: true,
//   connectionLimit: 10, // จำนวนการเชื่อมต่อที่สูงสุดที่อนุญาตใน pool
//   queueLimit: 0,
// });

// module.exports = pool;
