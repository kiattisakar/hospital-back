const sql = require("mssql");
const dbConfig = require("../config/dbConfig");
const express = require("express"); // เพิ่มการนำเข้า express
const app = express();
app.use(express.json());

async function room(req, res) {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query(`
        SELECT roomcode, roomname 
        FROM dbo.ms_room  
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("เกิดข้อผิดพลาดในเซิร์ฟเวอร์");
  } finally {
    await sql.close(); // ปิดการเชื่อมต่อ
  }
}

module.exports = {
  room,
};
