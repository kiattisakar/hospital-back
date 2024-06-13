// services/getDataFromWardTable.js
const sql = require('mssql');
const { pool, poolConnect } = require('../models/db');

async function get_data() {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM ms_ward ORDER BY wardcode ASC`;
        return result.recordset;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    } finally {
        sql.close();
    }
}

async function getWardData(req, res) {
    try {
        await poolConnect; // รอการเชื่อมต่อกับฐานข้อมูล

        // ดึงข้อมูลจากตาราง ms_ward โดยแสดงเฉพาะคอลัมน์ wardcode และ warddesc และเรียงตาม wardcode
        const result = await pool.request().query('SELECT wardcode, warddesc FROM ms_ward ORDER BY wardcode ASC');

        res.status(200).json(result.recordset); // ส่งผลลัพธ์กลับไปยังผู้เรียกใช้
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    get_data,
    getWardData,
};
