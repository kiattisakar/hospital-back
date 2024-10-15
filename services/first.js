const sql = require("mssql");
const { pool, poolConnect } = require("../models/db");

async function first(req, res) {
  const { wardcode } = req.body; // รับค่า wardcode จากผู้ใช้หรือส่วนต่อประกอบที่จะต้องใช้ในคำสั่ง SQL ในการค้นหา
  const search = req.body.search || ""; // รับค่า search จากผู้ใช้หรือส่วนต่อประกอบที่จะต้องใช้ในคำสั่ง SQL ในการค้นหา
  const ptstatus = req.body.ptstatus || ""; // รับค่า ptstatus จากผู้ใช้หรือส่วนต่อประกอบที่จะต้องใช้ในคำสั่ง SQL ในการค้นหา

  try {
    await poolConnect; // รอการเชื่อมต่อกับฐานข้อมูล

    // คำสั่ง SQL สำหรับดึงข้อมูลที่ต้องการจากตาราง
    let query = `
        SELECT    
                dbo.ms_ward.wardcode,    
                ('[' + dbo.ms_ward.wardcode + '] ' + dbo.ms_ward.warddesc) as warddesc,     
                count(DISTINCT dbo.ms_patientadmit.an) As countadmit     
           FROM    
                dbo.ms_patient    
                Left Join dbo.ms_patientadmit ON dbo.ms_patient.hn = dbo.ms_patientadmit.hn     
                Left Join dbo.ms_bedmove ON dbo.ms_patientadmit.an = dbo.ms_bedmove.an     
                Left Join dbo.ms_ward ON dbo.ms_bedmove.towardcode = dbo.ms_ward.wardcode     
                Left Join dbo.ms_patientDischarge ON  dbo.ms_patientadmit.an = dbo.ms_patientDischarge.an And dbo.ms_patientadmit.hn = dbo.ms_patientDischarge.hn     
           WHERE   dbo.ms_bedmove.status = 0   
                And dbo.ms_ward.wardcode Not IN ('1420')   
                AND dbo.ms_patientadmit.DCdatetime is null 
           GROUP BY   
                dbo.ms_ward.wardcode,    
                ('[' + dbo.ms_ward.wardcode + '] ' + dbo.ms_ward.warddesc)    
                ORDER BY CONVERT(INT,ms_ward.wardcode) ASC
           `;

    // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
    const result = await pool
      .request()
      .input("wardcode", sql.NVarChar, wardcode)
      .query(query);

    // เตรียมข้อมูลในรูปแบบที่ต้องการ
    const finalResults = result.recordset.map((record) => ({
      wardcode: record.wardcode,
      warddesc: record.warddesc,
      countadmit: record.countadmit,
    }));

    res.status(200).json(finalResults); // ส่งผลลัพธ์กลับไปยังผู้เรียกใช้
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Internal Server Error");
  }
}

const axios = require("axios");

async function second(req, res) {
  const { ptstatus, wardcode } = req.body;

  try {
    await poolConnect;

    const orderdate = new Date().toISOString().split("T")[0]; // แปลงวันที่ปัจจุบันเป็น ISO date string

    // ส่งคำขอไปยัง API แรกเพื่อดึงข้อมูล wardcode
    const firstApiResponse = await axios.post(
      "http://localhost:3000/api/first",
      { wardcode }
    );
    const firstApiData = firstApiResponse.data;

    // ตรวจสอบว่า wardcode ถูกต้องหรือไม่
    const wardExists = firstApiData.some((item) => item.wardcode === wardcode);
    if (!wardExists) {
      return res.status(404).send("Ward not found in the first API data");
    }

    // Query ข้อมูลผู้ป่วยที่ admit ในฐานข้อมูล
    let query = `
            SELECT
                ms_patientadmit.admitteddate,
                ms_patientDischarge.dischargeddate,
                ms_patientadmit.hn,
                ms_patientadmit.an,
                CASE WHEN ms_patient.patientlanguage = 'TH' THEN ms_patient.patientnameTH ELSE ms_patient.patientnameEN END AS patientname,
                ms_ward.wardcode,
                ('[' + ms_ward.wardcode + '] ' + ms_ward.warddesc) AS warddesc,
                count(DISTINCT prescriptionno) AS SumPresc
            FROM
                dbo.ms_patient
                LEFT JOIN dbo.ms_patientadmit ON dbo.ms_patient.hn = dbo.ms_patientadmit.hn
                LEFT JOIN dbo.ms_bedmove ON dbo.ms_patientadmit.an = dbo.ms_bedmove.an
                LEFT JOIN dbo.ms_ward ON dbo.ms_bedmove.towardcode = dbo.ms_ward.wardcode
                LEFT JOIN dbo.ms_patientDischarge ON dbo.ms_patientadmit.an = dbo.ms_patientDischarge.an 
                    AND dbo.ms_patientadmit.hn = dbo.ms_patientDischarge.hn
                LEFT JOIN prescriptionheader ON dbo.ms_patientadmit.hn = prescriptionheader.hn
                    AND dbo.ms_patientadmit.an = prescriptionheader.an
                    AND prescriptionheader.ordercreatedate = '${orderdate}'
            WHERE
                dbo.ms_bedmove.status = 0
                AND (dbo.ms_patientadmit.DCdatetime >= '${orderdate} 00:00:00' OR dbo.ms_patientadmit.DCdatetime IS NULL)
                AND dbo.ms_patientadmit.DCdatetime IS NULL
                AND ms_ward.wardcode = '${wardcode}'
            GROUP BY
                ms_patientadmit.admitteddate,
                ms_patientDischarge.dischargeddate,
                ms_patientadmit.hn,
                ms_patientadmit.an,
                ms_patient.patientlanguage,
                ms_patient.patientnameTH,
                ms_patient.patientnameEN,
                ms_ward.wardcode,
                ms_ward.warddesc
            ORDER BY
                ms_patientadmit.admitteddate ASC
        `;

    // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
    const result = await pool.request().query(query);

    // จัดรูปแบบข้อมูลที่ได้เพื่อส่งกลับ
    const finalResults = result.recordset.map((record) => ({
      admitteddate: record.admitteddate,
      dischargeddate: record.dischargeddate,
      hn: record.hn,
      an: record.an,
      patientname: record.patientname,
      SumPresc: record.SumPresc,
      warddesc: record.warddesc,
    }));

    // ส่งข้อมูลกลับไปยังผู้เรียกใช้
    res.status(200).json(finalResults);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  first,
  second,
};
