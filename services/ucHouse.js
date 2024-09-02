const sql = require("mssql");
const { pool, poolConnect } = require("../models/db");
const dbConfig = require("../config/dbConfig"); // นำเข้าค่าการกำหนดค่าฐานข้อมูล
const moment = require("moment");

async function ucHouse(req, res) {
  const { roomcode } = req.body; // รับค่า roomcode จากผู้ใช้

  try {
    // await poolConnect; // รอการเชื่อมต่อกับฐานข้อมูล
    await sql.connect(dbConfig); // เชื่อมต่อกับฐานข้อมูลโดยใช้ค่าการกำหนดที่ได้รับ

    // คำสั่ง SQL สำหรับดึงข้อมูลจากตาราง
    let query = `
      SELECT
        dr.orderitemcode,
        dr.orderitemTHname,
        dr.orderitemENname,
        dr.picname,
        ISNULL(s.Qty, 0) AS Qty,
        ISNULL(s.[Max], 0) AS Max,
        ISNULL(s.[Min], 0) AS Min,
        dr.orderunitcode
      FROM ms_drug dr
      LEFT JOIN ms_drugindex di ON dr.orderitemcode = di.orderitemcode
      LEFT JOIN ms_stock s ON dr.orderitemcode = s.orderitemcode
      WHERE s.roomcode = @roomcode 
      GROUP BY
        dr.orderitemcode,
        dr.orderitemTHname,
        dr.orderitemENname,
        dr.picname,
        s.Qty,
        s.[Max],
        s.[Min],
        dr.orderunitcode
      ORDER BY dr.orderitemENname ASC;
    `;

    // ส่งคำสั่ง SQL ไปยังฐานข้อมูล พร้อมกับค่า roomcode
    const result = await pool
      .request()
      .input("roomcode", sql.NVarChar, roomcode) // รับค่า roomcode จาก frontend
      .query(query);

    // เตรียมข้อมูลในรูปแบบที่ต้องการ
    const finalResults = result.recordset.map((record) => ({
      orderitemcode: record.orderitemcode,
      orderitemTHname: record.orderitemTHname,
      orderitemENname: record.orderitemENname,
      picname: record.picname,
      Qty: record.Qty,
      Max: record.Max,
      Min: record.Min,
      orderunitcode: record.orderunitcode,
    }));

    res.status(200).json(finalResults); // ส่งผลลัพธ์กลับไปยังผู้เรียกใช้
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Internal Server Error");
  }
}

async function stockHouse(req, res) {
  const { roomcode, orderitemcode } = req.body;

  try {
    await poolConnect;

    let query = `
    SELECT
      CONVERT(VARCHAR, r.ordercreatedate, 23) AS ordercreatedate,
      r.prescriptionno,
      r.orderitemcode,
      d.orderitemENname AS orderitemname,
      SUM(r.Qty) AS Qty,
      SUM(r.IN_Qty) AS IN_Qty,
      SUM(r.RETURN_Qty) AS RETURN_Qty
    FROM (
      SELECT
        CONVERT(VARCHAR, su.ordercreatedate, 23) AS ordercreatedate,
        CASE WHEN LEN(su.prescriptionno) > 10 THEN NULL ELSE su.prescriptionno END AS prescriptionno,
        su.orderitemcode,
        ISNULL(SUM(su.Qty), 0) AS Qty,
        0 AS IN_Qty,
        0 AS RETURN_Qty
      FROM ms_stockhistory su
      WHERE su.orderitemcode = @orderitemcode
        AND su.Note IN ('คลังยา', 'บริจาค', 'ยอดยก', 'ยายืม', 'ห้องผลิต')
        AND CONVERT(DATE, su.ordercreatedate) BETWEEN '2023-10-01' AND '2024-08-30'

      GROUP BY
        CONVERT(VARCHAR, su.ordercreatedate, 23),
        su.prescriptionno,
        su.orderitemcode

      UNION ALL

      SELECT
        CONVERT(DATE, su.confirmdatetime, 23) AS ordercreatedate,
        NULL AS prescriptionno,
        su.orderitemcode,
        0 AS Qty,
        ISNULL(SUM(su.orderqty), 0) AS IN_Qty,
        0 AS RETURN_Qty
      FROM ms_stockusedrug su
      WHERE su.orderitemcode = @orderitemcode
        AND CONVERT(DATE, su.confirmdatetime) BETWEEN '2023-10-01' AND '2024-08-30'

      GROUP BY
        su.confirmdatetime,
        su.orderitemcode

      UNION ALL

      SELECT
        CONVERT(DATE, su.ordercreatedate, 23) AS ordercreatedate,
        NULL AS prescriptionno,
        su.orderitemcode,
        0 AS Qty,
        0 AS IN_Qty,
        ISNULL(SUM(su.Qty), 0) AS RETURN_Qty
      FROM ms_stockhistory su
      WHERE su.orderitemcode = @orderitemcode
        AND su.Note NOT IN ('คลังยา', 'บริจาค', 'ยอดยก', 'ยายืม', 'ห้องผลิต')
        AND CONVERT(DATE, su.ordercreatedate) BETWEEN '2023-10-01' AND '2024-08-30'

      GROUP BY
        su.ordercreatedate,
        su.orderitemcode
    ) AS r
    LEFT JOIN ms_drug d ON r.orderitemcode = d.orderitemcode
    GROUP BY
      CONVERT(VARCHAR, r.ordercreatedate, 23),
      r.prescriptionno,
      r.orderitemcode,
      d.orderitemENname
    ORDER BY
      CONVERT(VARCHAR, r.ordercreatedate, 23) ASC
    `;
    const result = await pool
      .request()
      .input("roomcode", sql.NVarChar, roomcode)
      .input("orderitemcode", sql.NVarChar, orderitemcode)
      .query(query);

    const rows = result.recordset;

    // คำนวณค่าต่าง ๆ
    const totalReceive = rows.reduce(
      (sum, row) => sum + (row.Qty || 0) + (row.RETURN_Qty || 0),
      0
    );
    const totalDispense = rows.reduce((sum, row) => sum + (row.IN_Qty || 0), 0);
    const balance = totalReceive - totalDispense;

    // ส่งผลลัพธ์กลับไปยัง frontend
    res.status(200).json({
      data: result.recordset,
      receive: totalReceive,
      dispense: totalDispense,
      balance: balance,
    });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  stockHouse,
  ucHouse,
};
